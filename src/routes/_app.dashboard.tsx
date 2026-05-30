import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowDownUp,
  Bell,
  Plus,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { Spark } from "@/components/app/Spark";
import { LiveTicker } from "@/components/app/LiveTicker";
import { fmtUsd, useTicker, randomActivity } from "@/lib/mock";
import { useChain, CHAINS } from "@/lib/chain";
import { useState } from "react";
import { toast } from "sonner";
import { SwapWidget } from "@/components/app/SwapWidget";
import { DeAIAlertBuilder } from "@/components/app/DeAIAlertBuilder";

// ─── Animation Variants ────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ─── Stat Cards ────────────────────────────────────────────────────
function PortfolioStats() {
  const portfolio = useTicker(2000);
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      {[
        { label: "Total Portfolio", value: "$184.3K", delta: "+4.2%", icon: "wallet" },
        { label: "PnL · 24h", value: "$2.84K", delta: "+1.8%", icon: "chart" },
        { label: "Total Staked", value: "$48.1K", delta: "+0.4%", icon: "brain" },
        { label: "Yield · 24h", value: "$312", delta: "+12.1%", icon: "spark" },
      ].map((s) => (
        <motion.div key={s.label} variants={itemVariants}>
          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground flex items-center gap-2">
                {s.icon === "wallet" && <span className="inline-block h-4 w-4">👛</span>}
                {s.icon === "chart" && <Activity className="h-4 w-4" />}
                {s.icon === "brain" && <span className="inline-block h-4 w-4">🧠</span>}
                {s.icon === "spark" && <Sparkles className="h-4 w-4" />}
                {s.label}
              </span>
              <span className="text-xs font-medium text-success">{s.delta}</span>
            </div>
            <div className="text-2xl font-semibold tabular-nums">{s.value}</div>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Chain Allocation ──────────────────────────────────────────────
function ChainAllocation() {
  return (
    <GlassCard className="lg:col-span-2" glow>
      <SectionTitle
        icon={<Activity className="h-4 w-4" />}
        title="Portfolio Performance"
        hint="Multi-chain · 30d"
      />
      <Spark seed={11} height={220} />
      <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
        {CHAINS.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-surface-1/40 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className={`h-1.5 w-1.5 rounded-full`} style={{ background: c.color }} />
              {c.label}
            </div>
            <div className="mt-1 font-semibold tabular-nums">
              {fmtUsd(184_320 * (0.15 + (c.id.length % 4) * 0.15))}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ─── Activity Feed ─────────────────────────────────────────────────
function ActivityFeed() {
  const tick = useTicker(2000);
  const feed = Array.from({ length: 8 }, (_, i) => randomActivity(tick + i * 7));
  return (
    <GlassCard className="lg:col-span-2">
      <SectionTitle
        icon={<Bell className="h-4 w-4" />}
        title="Live Activity Ticker"
        hint="Global · realtime"
        action={
          <Link to="/socialfi" className="text-xs text-muted-foreground hover:text-foreground">
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
              <span className={`h-2 w-2 rounded-full bg-[color:var(--chain)] chain-glow`} />
              <span className="font-mono text-xs text-muted-foreground">{it.wallet}</span>
              <span className="text-foreground/90">{it.verb}</span>
              <span className="font-semibold text-[color:var(--chain)]">
                {it.amount} {it.token}
              </span>
            </span>
            <span className="text-xs text-muted-foreground">{i + 1}s ago</span>
          </motion.li>
        ))}
      </ul>
    </GlassCard>
  );
}

// ─── Dashboard Page ────────────────────────────────────────────────
export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Prophet" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { chain } = useChain();

  return (
    <>
      <PageHeader
        eyebrow="Command Center"
        title="Welcome back, Prophet."
        description={`Currently viewing ${CHAINS.find((c) => c.id === chain)?.label} cluster. Multi-chain portfolio aggregated in real-time.`}
        actions={
          <Link
            to="/copilot"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[color:var(--chain)]/40 bg-[color:var(--chain)]/10 px-4 text-xs font-medium text-[color:var(--chain)] hover:chain-glow"
          >
            <Sparkles className="h-3.5 w-3.5" /> Open AI Copilot
          </Link>
        }
      />

      <PortfolioStats />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <ChainAllocation />
        <motion.div variants={itemVariants}>
          <SwapWidget />
        </motion.div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <ActivityFeed />
        <motion.div variants={itemVariants}>
          <DeAIAlertBuilder />
        </motion.div>
      </div>

      <LiveTicker />
    </>
  );
}