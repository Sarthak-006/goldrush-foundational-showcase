"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import { useId, useMemo } from "react";
import { TruthTip } from "./TruthTip";

type Point = { date: string; value: number };

function formatUsdAxis(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `$${(value / 1e3).toFixed(1)}k`;
  return `$${value.toFixed(0)}`;
}

function formatUsdFull(value: number): string {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function MomentumChart({
  series,
  hasPortfolioError,
  isSpotFallback,
  reduceMotion,
}: {
  series: Point[];
  hasPortfolioError: boolean;
  isSpotFallback?: boolean;
  reduceMotion?: boolean;
}) {
  const fillId = useId().replace(/:/g, "");

  const chartData = useMemo(
    () =>
      series.map((p) => {
        const d = new Date(p.date);
        const label = Number.isNaN(d.getTime())
          ? p.date
          : d.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });
        return { ...p, label };
      }),
    [series]
  );

  const empty = chartData.length === 0;
  const values = chartData.map((p) => p.value);
  const latest = values.at(-1) ?? 0;
  const kickoff = values[0] ?? 0;
  const delta = latest - kickoff;
  const deltaPct =
    kickoff > 0 ? ((latest - kickoff) / kickoff) * 100 : null;

  const yDomain = useMemo(() => {
    if (!values.length) return [0, 1] as [number, number];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min;
    const pad = span > 0 ? span * 0.12 : Math.max(max * 0.08, 1);
    return [Math.max(0, min - pad), max + pad] as [number, number];
  }, [values]);

  return (
    <section className="relative">
      <motion.div
        initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.35 }}
        className="momentum-panel overflow-hidden rounded-3xl border border-white/15 shadow-2xl shadow-black/50"
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
          className="border-b border-white/10 bg-gradient-to-r from-amber-500/10 via-transparent to-emerald-500/10 px-5 py-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Activity className="size-5 text-amber-400" aria-hidden />
                <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white">
                  SEASON MOMENTUM
                </h2>
                <TruthTip
                  label="Season momentum chart"
                  detail="Primary series: aggregated holding timestamps from GET …/portfolio_v2/?quote-currency=USD&days=21. When that yields no points, the server falls back to two synthetic points at the current balances_v2 USD sum (see amber banner). Y-axis is always USD, not goals or league points."
                />
              </div>
              <p className="max-w-2xl text-sm text-zinc-400">
                Aggregated USD valuation from{" "}
                <code className="rounded bg-black/40 px-1 text-xs">
                  portfolio_v2
                </code>{" "}
                holdings time series. Think of it as your club&apos;s league
                position over the last few matchweeks.
              </p>
            </div>

            {!empty ? (
              <div className="flex flex-wrap gap-2">
                <div className="rounded-xl border border-white/10 bg-black/35 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Matchweek close
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-2xl tabular-nums text-amber-200">
                    {formatUsdFull(latest)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/35 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Since kickoff
                  </p>
                  <p
                    className={`flex items-center gap-1 font-[family-name:var(--font-display)] text-2xl tabular-nums ${
                      delta > 0
                        ? "text-emerald-300"
                        : delta < 0
                          ? "text-red-300"
                          : "text-zinc-300"
                    }`}
                  >
                    {delta > 0 ? (
                      <TrendingUp className="size-4" aria-hidden />
                    ) : delta < 0 ? (
                      <TrendingDown className="size-4" aria-hidden />
                    ) : null}
                    {deltaPct == null
                      ? "—"
                      : `${deltaPct > 0 ? "+" : ""}${deltaPct.toFixed(1)}%`}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>

        {isSpotFallback ? (
          <p className="border-b border-amber-500/20 bg-amber-950/35 px-5 py-2 text-xs text-amber-100/95">
            <strong>Spot estimate:</strong> no historical buckets parsed from{" "}
            <code className="rounded bg-black/30 px-1">portfolio_v2</code> for
            this wallet — showing a flat line at the current{" "}
            <code className="rounded bg-black/30 px-1">balances_v2</code> USD
            total so the chart still renders.
          </p>
        ) : null}

        <div className="h-80 px-3 py-4 sm:px-5">
          {empty ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-zinc-400">
              <p>No time series returned for this wallet / chain.</p>
              {hasPortfolioError ? (
                <p className="text-xs text-amber-200/80">
                  The portfolio endpoint returned an error — check credits or
                  chain support.
                </p>
              ) : (
                <p className="max-w-md text-xs text-zinc-500">
                  GoldRush still returned a valid response; this shape may use
                  fields we don&apos;t aggregate yet. Squad cards above use live{" "}
                  <code className="rounded bg-black/30 px-1">balances_v2</code>{" "}
                  data.
                </p>
              )}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.45} />
                    <stop offset="55%" stopColor="#34d399" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#065f46" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4 8"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                  tickLine={false}
                  minTickGap={24}
                />
                <YAxis
                  tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  tickFormatter={formatUsdAxis}
                  axisLine={false}
                  tickLine={false}
                  width={64}
                  domain={yDomain}
                />
                <Tooltip
                  cursor={{ stroke: "rgba(251,191,36,0.35)", strokeWidth: 1 }}
                  contentStyle={{
                    background: "rgba(6,12,24,0.96)",
                    border: "1px solid rgba(251,191,36,0.25)",
                    borderRadius: "14px",
                    fontSize: "12px",
                    boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
                  }}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.date
                      ? new Date(payload[0].payload.date).toLocaleString()
                      : ""
                  }
                  formatter={(value: number) => [
                    formatUsdFull(value),
                    "Squad valuation",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#fbbf24"
                  strokeWidth={2.5}
                  fill={`url(#${fillId})`}
                  activeDot={{
                    r: 5,
                    fill: "#fbbf24",
                    stroke: "#0a1628",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </section>
  );
}
