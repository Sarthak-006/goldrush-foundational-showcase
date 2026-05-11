"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { BalancePlayer } from "@/types/balance";
import { playerAriaLabel } from "@/lib/roster";

const FORMATION = [
  { role: "GK", top: "86%", left: "50%", label: "Sweeper-keeper" },
  { role: "LB", top: "68%", left: "12%", label: "Full-back" },
  { role: "CB", top: "72%", left: "32%", label: "Centre-back" },
  { role: "CB", top: "72%", left: "68%", label: "Centre-back" },
  { role: "RB", top: "68%", left: "88%", label: "Full-back" },
  { role: "LM", top: "46%", left: "14%", label: "Wide mid" },
  { role: "CM", top: "48%", left: "38%", label: "Engine room" },
  { role: "CM", top: "48%", left: "62%", label: "Engine room" },
  { role: "RM", top: "46%", left: "86%", label: "Wide mid" },
  { role: "ST", top: "24%", left: "36%", label: "Striker" },
  { role: "ST", top: "24%", left: "64%", label: "Striker" },
];

function formIcon(p: BalancePlayer) {
  const q = p.quote ?? 0;
  const q24 = p.quote_24h ?? q;
  if (!q24 || !q) return <Minus className="size-3 text-zinc-400" aria-hidden />;
  const delta = (q - q24) / Math.max(q24, 1e-9);
  if (delta > 0.02)
    return <TrendingUp className="size-3 text-emerald-400" aria-hidden />;
  if (delta < -0.02)
    return <TrendingDown className="size-3 text-red-400" aria-hidden />;
  return <Minus className="size-3 text-zinc-400" aria-hidden />;
}

export function PitchSquad({
  squad,
  reduceMotion: reduceMotionProp,
}: {
  squad: BalancePlayer[];
  reduceMotion?: boolean;
}) {
  const systemReduce = useReducedMotion();
  const reduce = reduceMotionProp ?? systemReduce ?? false;
  const empty = squad.length === 0;

  return (
    <section>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.35 }}
        className="mb-4"
      >
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white">
          THE PITCH — STARTING XI
        </h2>
        <p className="text-sm text-zinc-400">
          Formation 4-4-2 · Positions by squad depth (USD value). Icons =
          short-term move vs <code className="text-zinc-500">quote_24h</code>{" "}
          (not sporting form). Hover the pitch for a quick project guide.
        </p>
      </motion.div>

      {empty ? (
        <div className="mb-4 rounded-xl border border-amber-500/35 bg-amber-950/35 px-4 py-3 text-sm text-amber-100">
          No <strong>priced</strong> outfield tokens (spam filtered, no dust/NFT
          with USD quote). Try another address or chain — or fund this wallet.
        </div>
      ) : null}

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.25 }}
        className="group/pitch relative overflow-hidden rounded-3xl border-2 border-white/25 shadow-2xl shadow-black/60"
      >
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-[#050a12]/80 px-6 py-8 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/pitch:pointer-events-auto group-hover/pitch:opacity-100 group-focus-within/pitch:pointer-events-auto group-focus-within/pitch:opacity-100">
          <div className="max-w-md rounded-2xl border border-amber-400/35 bg-black/70 p-5 text-center shadow-2xl">
            <p className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-amber-200">
              TRAINING GROUND
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-200">
              A football-themed wallet dashboard. Your address is the club, each
              token is a player, and every stat comes from GoldRush Foundational
              REST — not league or FIFA data.
            </p>
            <p className="mt-3 text-xs text-zinc-400">
              XI from <code className="text-zinc-300">balances_v2</code> · chart
              from <code className="text-zinc-300">portfolio_v2</code> · caps
              from <code className="text-zinc-300">transactions_summary</code>
            </p>
          </div>
        </div>

        <div className="absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-zinc-900/90 to-transparent" />
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.25 }}
          className="pitch-stripes relative aspect-[5/3] w-full max-h-[520px] min-h-[340px]"
        >
          <div className="grass-shimmer pointer-events-none absolute inset-0" />

          <div className="absolute left-[8%] right-[8%] top-1/2 z-[1] h-0.5 -translate-y-1/2 bg-[var(--pitch-line)]/90" />
          <div className="absolute left-1/2 top-1/2 z-[1] size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--pitch-line)]/90" />
          <div className="absolute bottom-[6%] left-1/2 z-[1] h-[28%] w-[44%] -translate-x-1/2 rounded-t-lg border-2 border-b-0 border-[var(--pitch-line)]/90" />
          <div className="absolute top-[6%] left-1/2 z-[1] h-[28%] w-[44%] -translate-x-1/2 rounded-b-lg border-2 border-t-0 border-[var(--pitch-line)]/90" />
          <div className="absolute bottom-2 left-2 z-[1] size-6 rounded-br border-b-2 border-r-2 border-[var(--pitch-line)]/80" />
          <div className="absolute bottom-2 right-2 z-[1] size-6 rounded-bl border-b-2 border-l-2 border-[var(--pitch-line)]/80" />
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 0.25 }}
            className="absolute left-2 top-2 z-[1] size-6 rounded-tr border-r-2 border-t-2 border-[var(--pitch-line)]/80"
          />
          <div className="absolute right-2 top-2 z-[1] size-6 rounded-tl border-l-2 border-t-2 border-[var(--pitch-line)]/80" />

          {FORMATION.map((pos, i) => {
            const player = squad[i];
            const isCaptain = i === 0 && Boolean(player);
            return (
              <motion.div
                key={pos.role + i}
                initial={
                  reduce
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.92, y: 12 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { delay: 0.04 * i, type: "spring", stiffness: 260 }
                }
                className="absolute z-20 w-[24%] max-w-[152px] -translate-x-1/2 -translate-y-1/2"
                style={{ top: pos.top, left: pos.left }}
              >
                {player ? (
                  <article
                    className="relative rounded-2xl border border-white/30 bg-gradient-to-b from-zinc-900/90 to-black/80 p-2.5 text-center shadow-xl shadow-black/50 ring-1 ring-amber-400/20 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-amber-300/50 hover:ring-amber-300/40"
                    aria-label={playerAriaLabel(player)}
                  >
                    {isCaptain ? (
                      <span className="absolute -right-1 -top-1 rounded-full border border-amber-300/60 bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-black shadow">
                        C
                      </span>
                    ) : null}
                    <span className="absolute left-1 top-1 rounded bg-black/55 px-1 py-0.5 text-[8px] font-bold tracking-wide text-amber-200">
                      {pos.role}
                    </span>
                    <div className="mb-1 flex items-center justify-center gap-1">
                      {player.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={player.logo_url}
                          alt=""
                          loading="lazy"
                          className="size-10 rounded-full border-2 border-white/25 bg-white/10 object-contain"
                        />
                      ) : (
                        <motion.div
                          initial={reduce ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={reduce ? { duration: 0 } : { duration: 0.25 }}
                          className="flex size-10 items-center justify-center rounded-full border-2 border-white/25 bg-white/10 text-xs font-bold text-white"
                        >
                          {(player.contract_ticker_symbol ?? "?").slice(0, 3)}
                        </motion.div>
                      )}
                      <span className="inline-flex" aria-hidden>
                        {formIcon(player)}
                      </span>
                    </div>
                    <p className="truncate text-[11px] font-bold uppercase tracking-tight text-white">
                      {player.contract_ticker_symbol ?? "NATIVE"}
                    </p>
                    <p className="truncate text-[9px] text-zinc-400">
                      {pos.label}
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold text-amber-300 tabular-nums">
                      {player.pretty_quote ??
                        `$${(player.quote ?? 0).toFixed(2)}`}
                    </p>
                  </article>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/25 bg-black/35 p-2 text-center text-[10px] text-zinc-500">
                    Open tryout
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
