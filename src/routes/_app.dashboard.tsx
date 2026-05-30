import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowDownUp,
  Bell,
  Brain,
  Plus,
  Sparkles,
  Wallet as WalletIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { Spark } from "@/components/app/Spark";
import { LiveTicker } from "@/components/app/LiveTicker";
import { PortfolioStats } from "@/components/app/PortfolioStats";
import { ChainAllocation } from "@/components/app/ChainAllocation";
import { useLivePrice, fmtUsd, useTicker, randomActivity } from "@/lib/mock";
import { useChain, CHAINS } from "@/lib/chain";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Prophet" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { chain } = useChain();
  const portfolio = useLivePrice(184_320, 0.004);
  const pnl = useLivePrice(2_840, 0.01);
  const staked = useLivePrice(48_120, 0.003);
  const yieldEarned = useLivePrice(312, 0.01);
  const tick = useTicker(2000);
  const feed = Array.from({ length: 8 }, (_, i) => randomActivity(tick + i * 7));

  const [from, setFrom] = useState("SOL");
  const [to, setTo] = useState("PROPHET");
  const [amt, setAmt] = useState("1.0");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <PageHeader
        eyebrow="Command Center"
        title="Welcome back, Prophet."
        description={`Currently viewing ${CHAINS.find(
          (c) => c.id === chain
        )?.label} cluster. Multi-chain portfolio aggregated in real-time.`}
        actions={
          <Link
            to="/copilot"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[color:var(--chain)]/40 bg-[color:var(--chain)]/10 px-4 text-xs font-medium text-[color:var(--chain)] hover:chain-glow"
          >
            <Sparkles className="h-3.5 w-3.5" /> Open AI Copilot
          </Link>
        }
      />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <motion.div variants={itemVariants}>
          <PortfolioStats />
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-8 grid gap-4 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard className="lg:col-span-2" glow>
            <SectionTitle
              icon={<Activity className="h-4 w-4" />}
              title="Portfolio Performance"
              hint="Multi-chain · 30d"
            />
            <Spark seed={11} height={220} />
            <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
              {CHAINS.map((c) => (
                <div
                  key={c.id}
                  className="rounded-lg border border-border bg-surface-1/40 p-3"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className={`h-1.5 w-1.5 rounded-full`}
                      style={{ background: c.color }}
                    />
                    {c.label}
                  </div>
                  <div className="mt-1 font-semibold tabular-nums">
                    {fmtUsd(
                      portfolio * (0.15 + (c.id.length % 4) * 0.15)
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard glow>
            <SectionTitle
              icon={<ArrowDownUp className="h-4 w-4" />}
              title="Swap"
              hint="Jupiter / Uniswap"
            />
            <div className="space-y-3">
              <div
                className="rounded-xl border border-border bg-surface-1/40 p-3"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  From
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <input
                    value={amt}
                    onChange={(e) => setAmt(e.target.value)}
                    className="w-full bg-transparent text-2xl font-semibold tabular-nums outline-none"
                  />
                  <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="rounded-lg border border-border bg-surface-2/60 px-2 py-1 text-sm"
                  >
                    {["SOL", "USDC", "BNB", "ETH"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const t = from;
                    setFrom(to);
                    setTo(t);
                  }}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface-1 hover:chain-glow"
                >
                  <ArrowDownUp className="h-4 w-4" />
                </button>
              </div>
              <div
                className="rounded-xl border border-border bg-surface-1/40 p-3"
              >
                <div className="text-xs text-muted-foreground">To (estimated)</div>
                <div className="mt-1 flex items-center justify-between">
                  <div
                    className="text-2xl font-semibold tabular-nums text-[color:var(--chain)]"
                  >
                    {(parseFloat(amt || "0") * 64.2).toFixed(2)}
                  </div>
                  <select
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="rounded-lg border border-border bg-surface-2/60 px-2 py-1 text-sm"
                  >
                    {["PROPHET", "USDC", "SOL", "JUP"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() =>
                  toast.success("Swap submitted", {
                    description: `${amt} ${from} → ${to}`,
                  })
                }
                className="h-11 w-full rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] font-semibold text-primary-foreground"
              >
                Swap
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard glow>
            <SectionTitle
              icon={<Plus className="h-4 w-4" />}
              title="DeAI Alert Builder"
              hint="Personal"
            />
            <p className="text-xs text-muted-foreground">
              Create custom AI-powered triggers from on-chain & off-chain signals.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="rounded-lg border border-border bg-surface-1/40 p-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  IF
                </div>
                <div className="mt-1">
                  Token security score on <span className="text-[color:var(--chain)]">Solana</span>{" "}
                  ≥ <b>90</b>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-surface-1/40 p-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  THEN
                </div>
                <div className="mt-1">
                  Notify me & open in <span className="text-[color:var(--chain)]">DeAI Hub</span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() =>
                toast.success("Alert saved", {
                  description: "We'll ping you on triggers.",
                })
              }
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--chain)]/40 bg-[color:var(--chain)]/10 text-xs font-medium text-[color:var(--chain)]"
            >
              <Plus className="h-3.5 w-3.5" /> Save Alert
            </motion.button>
          </GlassCard>
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-8 grid gap-4 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard glow>
            <SectionTitle
              icon={<Bell className="h-4 w-4" />}
              title="Live Activity Ticker"
              hint="Global · realtime"
              action={
                <Link
                  to="/socialfi"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  View leaderboard →
                </Link>
              }
            />
            <ul className="divide-y divide-border">
              {feed.map((it, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`h-2 w-2 rounded-full bg-[color:var(--chain)] chain-glow`}
                    />
                    <span className="font-mono text-xs text-muted-foreground">
                      {it.wallet}
                    </span>
                    <span className="text-foreground/90">{it.verb}</span>
                    <span className="font-semibold text-[color:var(--chain)]">
                      {it.amount} {it.token}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {i + 1}s ago
                  </span>
                </motion.li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8">
        <LiveTicker />
      </motion.div>
    </>
  );
}