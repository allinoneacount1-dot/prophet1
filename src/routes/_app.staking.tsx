import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { StatCard } from "@/components/app/StatCard";
import { Coins, Crown, Sparkles } from "lucide-react";
import { fmtUsd, useLivePrice } from "@/lib/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/staking")({
  head: () => ({ meta: [{ title: "Staking & Yield — ProphetSol" }] }),
  component: Staking,
});

const POOLS = [
  { name: "$PROPHET · Flexible", chain: "Solana", apy: 18.2, tvl: 14_200_000 },
  { name: "$PROPHET · 30d Lock", chain: "Solana", apy: 28.6, tvl: 8_400_000 },
  { name: "$PROPHET · 90d Lock", chain: "BNB", apy: 42.4, tvl: 5_120_000 },
  { name: "USDC · Stable Yield", chain: "Base", apy: 11.2, tvl: 24_800_000 },
];

function Staking() {
  const [amount, setAmount] = useState(1000);
  const [days, setDays] = useState(90);
  const apy = 42.4;
  const reward = (amount * apy * (days / 365)) / 100;
  const earned = useLivePrice(312.42, 0.004);

  return (
    <>
      <PageHeader eyebrow="DeFi Portal" title="Staking & Yield Farming" description="Cross-chain staking with passive income claim, lock-up boosts, and a built-in APY calculator." />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Staked" value={fmtUsd(48_240)} icon={<Coins className="h-4 w-4" />} />
        <StatCard label="Claimable Rewards" value={`${earned.toFixed(2)} $PROPHET`} delta={{ value: "+4.1%", positive: true }} icon={<Sparkles className="h-4 w-4" />} />
        <StatCard label="Active Lock" value="90 days" icon={<Crown className="h-4 w-4" />} />
        <StatCard label="Tier" value="ELITE" delta={{ value: "Boost +2.4x", positive: true }} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <SectionTitle icon={<Coins className="h-4 w-4" />} title="Available Pools" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
                <tr><th className="py-2">Pool</th><th>Chain</th><th>APY</th><th>TVL</th><th></th></tr>
              </thead>
              <tbody>
                {POOLS.map((p) => (
                  <tr key={p.name} className="border-t border-border">
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="text-muted-foreground">{p.chain}</td>
                    <td className="font-semibold text-[color:var(--chain)]">{p.apy}%</td>
                    <td className="tabular-nums">{fmtUsd(p.tvl)}</td>
                    <td><button onClick={() => toast.success(`Stake flow opened: ${p.name}`)} className="rounded-lg border border-[color:var(--chain)]/40 bg-[color:var(--chain)]/10 px-3 py-1 text-xs text-[color:var(--chain)]">Stake</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard glow>
          <SectionTitle title="APY Calculator" />
          <label className="text-xs text-muted-foreground">Amount ($PROPHET)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(+e.target.value || 0)} className="mt-1 h-10 w-full rounded-lg border border-border bg-surface-1/60 px-3 text-sm outline-none focus:border-[color:var(--chain)]" />
          <label className="mt-3 block text-xs text-muted-foreground">Lock duration · {days}d</label>
          <input type="range" min={0} max={365} value={days} onChange={(e) => setDays(+e.target.value)} className="mt-1 w-full accent-[color:var(--chain)]" />
          <div className="mt-4 rounded-xl border border-[color:var(--chain)]/30 bg-[color:var(--chain)]/10 p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Estimated rewards</div>
            <div className="mt-1 text-3xl font-semibold text-[color:var(--chain)]">{reward.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">$PROPHET in {days} days · {apy}% APY</div>
          </div>
          <button onClick={() => toast.success("Staked", { description: `${amount} $PROPHET for ${days}d` })} className="mt-4 h-11 w-full rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] font-semibold text-primary-foreground">Stake Now</button>
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <SectionTitle title="Premium Tier Comparison" hint="Stake $PROPHET to unlock" />
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-widest text-muted-foreground"><tr><th className="py-2">Feature</th><th>Free</th><th>Pro</th><th>Elite</th></tr></thead>
            <tbody>
              {[
                ["AI Signals", "Basic", "Advanced", "Priority"],
                ["Early Gem Radar", "—", "✓", "✓"],
                ["Automated Vaults", "—", "—", "✓"],
                ["Whale Alerts", "—", "—", "✓"],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-border">
                  {row.map((c, i) => <td key={i} className={`py-2 ${i === 0 ? "" : "text-muted-foreground"}`}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
        <GlassCard glow>
          <SectionTitle title="Buy $PROPHET to Stake" />
          <p className="text-sm text-muted-foreground">Use the integrated swap to acquire $PROPHET before staking — routed through Jupiter for best execution.</p>
          <button onClick={() => toast.success("Opening Jupiter swap")} className="mt-4 h-11 w-full rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] font-semibold text-primary-foreground">Swap to $PROPHET</button>
        </GlassCard>
      </div>
    </>
  );
}