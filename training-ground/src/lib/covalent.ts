/**
 * GoldRush / Covalent Foundational REST — matches skills in .agents/skills/goldrush-foundational-api
 */
const API_BASE = "https://api.covalenthq.com/v1";

export type CovalentEnvelope<T> = {
  data: T | null;
  error: boolean;
  error_message?: string;
  error_code?: number;
};

export async function covalentFetch<T>(
  path: string,
  apiKey: string
): Promise<CovalentEnvelope<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      /** Never cache per-wallet responses (would leak data across users in prod). */
      cache: "no-store",
    });

    const text = await res.text();
    let json: CovalentEnvelope<T>;
    try {
      json = JSON.parse(text) as CovalentEnvelope<T>;
    } catch {
      return {
        data: null,
        error: true,
        error_message: `Upstream returned non-JSON (HTTP ${res.status}).`,
      };
    }
    return json;
  } catch (e) {
    return {
      data: null,
      error: true,
      error_message:
        e instanceof Error ? e.message : "Network error calling GoldRush API.",
    };
  }
}

/** Sum portfolio holdings across tokens into one time series for charts */
export function aggregatePortfolioSeries(
  items: PortfolioItem[] | null | undefined
): { date: string; value: number }[] {
  if (!items?.length) return [];

  const bucket = new Map<string, number>();

  for (const item of items) {
    const holdings = item.holdings;
    if (!Array.isArray(holdings)) continue;

    for (const h of holdings) {
      const row = h as Record<string, unknown>;
      const rawT = row.timestamp ?? row.block_signed_at ?? row.date;
      const t = rawT != null ? String(rawT) : "";
      if (!t) continue;

      const v = holdingQuoteUsd(row);
      if (v == null || v <= 0) continue;

      bucket.set(t, (bucket.get(t) ?? 0) + v);
    }
  }

  const sorted = [...bucket.entries()]
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return sorted;
}

/** Flat “season” line from current spot USD so the chart is never empty when balances exist. */
export function spotValuationFallbackSeries(totalUsd: number): {
  date: string;
  value: number;
}[] {
  if (!Number.isFinite(totalUsd) || totalUsd <= 0) return [];
  const now = new Date().toISOString();
  const t2 = new Date(Date.now() + 60_000).toISOString();
  return [
    { date: now, value: totalUsd },
    { date: t2, value: totalUsd },
  ];
}

function num(x: unknown): number | null {
  if (x == null) return null;
  const n = typeof x === "number" ? x : parseFloat(String(x));
  return Number.isFinite(n) ? n : null;
}

/** portfolio_v2 holdings use OHLC buckets with nested `quote` fields. */
function holdingQuoteUsd(h: Record<string, unknown>): number | null {
  for (const key of ["close", "high", "low", "open"] as const) {
    const box = h[key];
    if (box && typeof box === "object") {
      const q = num((box as Record<string, unknown>).quote);
      if (q != null && q > 0) return q;
    }
  }

  return (
    num(h.close_quote) ??
    num(h.high_quote) ??
    num(h.open_quote) ??
    num(h.quote) ??
    num(h.close_balance_quote) ??
    (typeof h.close === "number" ? h.close : null)
  );
}

export type PortfolioItem = {
  contract_address?: string;
  contract_ticker_symbol?: string;
  contract_name?: string;
  holdings?: Record<string, unknown>[];
};

/** Keep portfolio rows aligned with the priced, non-dust roster from balances_v2. */
export function filterPortfolioByBalanceRoster(
  portfolioItems: PortfolioItem[] | null | undefined,
  balanceItems:
    | {
        contract_address?: string;
        quote?: number;
        type?: string;
      }[]
    | null
    | undefined
): PortfolioItem[] {
  if (!portfolioItems?.length) return [];
  if (!balanceItems?.length) return portfolioItems;

  const allowed = new Set<string>();
  for (const row of balanceItems) {
    if ((row.quote ?? 0) <= 0) continue;
    if (row.type === "dust" || row.type === "nft") continue;
    const addr = row.contract_address?.toLowerCase();
    if (addr) allowed.add(addr);
  }

  if (!allowed.size) return portfolioItems;

  return portfolioItems.filter((item) => {
    const addr = item.contract_address?.toLowerCase();
    return Boolean(addr && allowed.has(addr));
  });
}

export function isValidEvmAddress(addr: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(addr.trim());
}
