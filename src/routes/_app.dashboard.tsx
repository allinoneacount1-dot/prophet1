import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowDownUp, Bell, Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { Spark } from "@/components/app/Spark";
import { LiveTicker } from "@/components/app/LiveTicker";
import { fmtUsd, useTicker, randomActivity } from "@/lib/mock";
import { useChain, CHAINS } from "@/lib/chain";
import { useNativeWallet, shortAddr } from "@/lib/use-native-wallet";
import { useOnChainPortfolio } from "@/lib/useOnchain";
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

// ─── Real Portfolio Stats ──────────────────────────────────────────
function PortfolioStats() {
  const { publicKey } = useNativeWallet();
  const { data: portfolio, isLoading, error } = useOnChainPortfolio(publicKey);

  if (!publicKey) {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Portfolio", value: "—", delta: "Connect wallet", icon: "wallet" },
          { label: "SOL Balance", value: "—", delta: "Connect wallet", icon: "chart" },
          { label: "Tokens", value: "—", delta: "—", icon: "brain" },
          { label: "Network", value: "Solana", delta: "Mainnet", icon: "spark" },
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
                <span className="text-xs font-medium text-muted-foreground">{s.delta}</span>
              </div>
              <div className="text-2xl font-semibold tabular-nums text-muted-foreground">{s.value}</div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {["Total Portfolio", "SOL Balance", "Tokens", "Status"].map((label) => (
          <GlassCard key={label}>
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="mt-2 h-8 w-24 animate-pulse rounded bg-white/10" />
          </GlassCard>
        ))}
      </motion.div>
    );
  }

  if (error || !portfolio) {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Portfolio", value: "Error", delta: "Retrying...", icon: "wallet" },
          { label: "SOL Balance", value: "—", delta: "", icon: "chart" },
          { label: "Tokens", value: "—", delta: "—", icon: "brain" },
          { label: "Network", value: "Solana", delta: "Mainnet", icon: "spark" },
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
                <span className="text-xs font-medium text-warning">{s.delta}</span>
              </div>
              <div className="text-2xl font-semibold tabular-nums">{s.value}</div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  const stats = [
    { label: "Total Portfolio", value: fmtUsd(portfolio.totalValue), delta: `$${portfolio.totalValue.toFixed(2)}`, icon: "wallet" },
    { label: "SOL Balance", value: `${portfolio.solBalance.toFixed(4)} SOL`, delta: portfolio.prices?.[0] ? `@ $${portfolio.prices[0].price.toFixed(2)}` : "", icon: "chart" },
    { label: "Tokens", value: `${portfolio.tokenBalances.length} assets`, delta: portfolio.tokenBalances.length > 0 ? portfolio.tokenBalances.map(t => t.symbol).join(", ") : "None", icon: "brain" },
    { label: "Network", value: "Solana", delta: "Mainnet · β", icon: "spark" },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => (
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

// ─── Chain Allocation (real) ────────────────────────────────────────
function ChainAllocation() {
  const { publicKey } = useNativeWallet();
  const { data: portfolio } = useOnChainPortfolio(publicKey);

  return (
    <GlassCard className="lg:col-span-2" glow>
      <SectionTitle icon={<Activity className="h-4 w-4" />} title="Portfolio Performance" hint="On-chain · realtime" />
      <Spark seed={11} height={220} />
      <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
        {portfolio?.chainBreakdown?.length ? (
          portfolio.chainBreakdown.map((c) => (
            <div key={c.chain} className="rounded-lg border border-border bg-surface-1/40 p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
                {c.chain}
              </div>
              <div className="mt-1 font-semibold tabular-nums">
                {c.value > 0 ? fmtUsd(c.value) : "—"}
              </div>
            </div>
          ))
        ) : (
          CHAINS.map((c) => (
            <div key={c.id} className="rounded-lg border border-border bg-surface-1/40 p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
                {c.label}
              </div>
              <div className="mt-1 font-semibold tabular-nums text-muted-foreground">—</div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
}

// ─── Token Holdings Table ──────────────────────────────────────────
function TokenHoldings() {
  const { publicKey } = useNativeWallet();
  const { data: portfolio, isLoading } = useOnChainPortfolio(publicKey);

  if (!publicKey) {
    return (
      <GlassCard>
        <SectionTitle title="Token Holdings" hint="Connect wallet to view" />
        <div className="py-8 text-center text-sm text-muted-foreground">
          Connect your wallet to see on-chain token balances
        </div>
      </GlassCard>
    );
  }

  if (isLoading) {
    return (
      <GlassCard>
        <SectionTitle title="Token Holdings" />
        <div className="space-y-3 py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-full animate-pulse rounded bg-white/5" />
          ))}
        </div>
      </GlassCard>
    );
  }

  const tokens = portfolio?.tokenBalances || [];
  const hasTokens = tokens.length > 0;

  return (
    <GlassCard>
      <SectionTitle
        title="Token Holdings"
        hint={hasTokens ? `${tokens.length} tokens` : "No SPL tokens found"}
      />
      {!hasTokens ? (
        <div className="py-6 text-center text-sm text-muted-foreground">
          No SPL tokens found. Fund your wallet to get started.
          {portfolio && portfolio.solBalance > 0 && (
            <div className="mt-2 text-[color:var(--chain)]">
              SOL: {portfolio.solBalance.toFixed(4)} (native balance)
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="py-2">Token</th>
                <th>Balance</th>
                <th>Price</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {/* Always show SOL */}
              {portfolio && (
                <tr className="border-t border-border">
                  <td className="py-3 font-semibold">SOL</td>
                  <td className="tabular-nums">{portfolio.solBalance.toFixed(4)}</td>
                  <td className="tabular-nums text-muted-foreground">
                    ${((portfolio.prices || []).find(p => p.symbol === "SOL")?.price || 0).toFixed(2)}
                  </td>
                  <td className="tabular-nums font-medium">
                    {fmtUsd(portfolio.solBalance * ((portfolio.prices || []).find(p => p.symbol === "SOL")?.price || 0))}
                  </td>
                </tr>
              )}
              {tokens.map((t) => (
                <tr key={t.symbol} className="border-t border-border">
                  <td className="py-3 font-semibold">{t.symbol}</td>
                  <td className="tabular-nums">{t.amount.toFixed(4)}</td>
                  <td className="tabular-nums text-muted-foreground">${t.price.toFixed(4)}</td>
                  <td className="tabular-nums font-medium">{fmtUsd(t.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
              <span className="h-2 w-2 rounded-full bg-[color:var(--chain)] chain-glow" />
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
  const { connected, publicKey } = useNativeWallet();

  return (
    <>
      <PageHeader
        eyebrow="Command Center"
        title={connected ? `Connected: ${shortAddr(publicKey)}` : "Welcome, Prophet."}
        description={
          connected
            ? `Viewing live on-chain data for ${shortAddr(publicKey)}. Refreshing every 30s.`
            : `Currently viewing ${CHAINS.find((c) => c.id === chain)?.label} cluster. Connect wallet to see real on-chain data.`
        }
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

      <div className="mt-8">
        <TokenHoldings />
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
