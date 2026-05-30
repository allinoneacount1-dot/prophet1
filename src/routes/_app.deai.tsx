import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { StatCard } from "@/components/app/StatCard";
import { Spark } from "@/components/app/Spark";
import { Brain, Crown, Flame, Radar, Vault, Zap } from "lucide-react";
import { useTicker } from "@/lib/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/deai")({
  head: () => ({ meta: [{ title: "DeAI Intelligence Hub — ProphetSol" }] }),
  component: DeAI,
});

const GEMS = [
  { sym: "$ORACLE", chain: "Solana", score: 94, mc: "$1.2M", liq: "$420K", smart: "+82%" },
  { sym: "$NEUR", chain: "Base", score: 88, mc: "$3.4M", liq: "$880K", smart: "+64%" },
  { sym: "$AETHER", chain: "BNB", score: 86, mc: "$640K", liq: "$210K", smart: "+71%" },
  { sym: "$PHOTON", chain: "Solana", score: 79, mc: "$8.1M", liq: "$2.1M", smart: "+33%" },
  { sym: "$RUNE", chain: "Ethereum", score: 76, mc: "$12M", liq: "$4.4M", smart: "+22%" },
];

const VAULTS = [
  { name: "Alpha Hunter", apr: "48.2%", tvl: "$8.4M", risk: "High", tier: "PRO" },
  { name: "Stable Compound", apr: "12.4%", tvl: "$24.1M", risk: "Low", tier: "FREE" },
  { name: "Smart Money Mirror", apr: "32.7%", tvl: "$6.2M", risk: "Medium", tier: "ELITE" },
];

function DeAI() {
  useTicker(2000);
  return (
    <>
      <PageHeader
        eyebrow="Intelligence Hub"
        title="DeAI · The Oracle Layer"
        description="Real-time on-chain intelligence, alpha discovery, and automated AI-managed vaults."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="AI Prediction Accuracy" value="94.2%" delta={{ value: "+0.4%", positive: true }} icon={<Brain className="h-4 w-4" />} />
        <StatCard label="Sentiment Score" value="78 / 100" delta={{ value: "Bullish", positive: true }} icon={<Zap className="h-4 w-4" />} />
        <StatCard label="Live Alpha Signals" value="142" delta={{ value: "+18", positive: true }} icon={<Radar className="h-4 w-4" />} />
        <StatCard label="Smart Money Tracked" value="3,284" icon={<Crown className="h-4 w-4" />} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2" glow>
          <SectionTitle icon={<Radar className="h-4 w-4" />} title="Early Gem Radar" hint="AI-scored launches" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
                <tr><th className="py-2">Token</th><th>Chain</th><th>Sec Score</th><th>MC</th><th>Liq</th><th>Smart</th><th></th></tr>
              </thead>
              <tbody>
                {GEMS.map((g) => (
                  <tr key={g.sym} className="border-t border-border">
                    <td className="py-3 font-semibold">{g.sym}</td>
                    <td className="text-muted-foreground">{g.chain}</td>
                    <td><span className="rounded-full bg-[color:var(--chain)]/15 px-2 py-0.5 text-xs text-[color:var(--chain)]">{g.score}</span></td>
                    <td className="tabular-nums">{g.mc}</td>
                    <td className="tabular-nums">{g.liq}</td>
                    <td className="text-[color:var(--success)]">{g.smart}</td>
                    <td><button onClick={() => toast.success(`Watching ${g.sym}`)} className="text-xs text-[color:var(--chain)] hover:underline">Track</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard glow>
          <SectionTitle icon={<Brain className="h-4 w-4" />} title="Market Prediction" hint="Next 24h" />
          <Spark seed={42} height={180} />
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-semibold text-[color:var(--success)]">High · 87%</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Trend</span>
            <span className="font-semibold">Bullish reversal</span>
          </div>
        </GlassCard>
      </div>

      <div className="mt-8">
        <SectionTitle icon={<Vault className="h-4 w-4" />} title="AI Copy Trading & Automated Vaults" hint="Tiered strategies" />
        <div className="grid gap-4 md:grid-cols-3">
          {VAULTS.map((v) => (
            <GlassCard key={v.name} glow>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold">{v.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Risk: {v.risk}</div>
                </div>
                <span className="rounded-full bg-[color:var(--chain)]/15 px-2 py-0.5 text-[10px] font-bold text-[color:var(--chain)]">{v.tier}</span>
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                <div className="text-3xl font-semibold tabular-nums text-[color:var(--chain)]">{v.apr}</div>
                <div className="text-xs text-muted-foreground">APR</div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">TVL: {v.tvl}</div>
              <button onClick={() => toast.success(`Deposit flow opened: ${v.name}`)} className="mt-4 h-10 w-full rounded-lg border border-[color:var(--chain)]/40 bg-[color:var(--chain)]/10 text-xs font-medium text-[color:var(--chain)] hover:chain-glow">
                Deposit USDC / SOL
              </button>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="mt-8 glass-strong rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <Flame className="h-5 w-5 text-[color:var(--chain)]" />
          <div>
            <div className="text-sm font-semibold">Premium DeAI Access</div>
            <div className="text-xs text-muted-foreground">Unlock Early Gem Radar PRO, Whale Alerts, and Automated Vaults with $PROPHET.</div>
          </div>
        </div>
      </div>
    </>
  );
}