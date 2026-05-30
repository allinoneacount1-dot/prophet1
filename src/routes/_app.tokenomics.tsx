import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { StatCard } from "@/components/app/StatCard";
import { Spark } from "@/components/app/Spark";
import { Flame } from "lucide-react";
import { useLivePrice, fmt } from "@/lib/mock";

export const Route = createFileRoute("/_app/tokenomics")({
  head: () => ({ meta: [{ title: "Tokenomics & Burn — ProphetSol" }] }),
  component: Tokenomics,
});

const ALLOC = [
  { name: "Community & Airdrops", pct: 32, color: "var(--chain)" },
  { name: "Staking Rewards", pct: 24, color: "var(--chain-2)" },
  { name: "Treasury & DAO", pct: 18, color: "oklch(0.78 0.18 60)" },
  { name: "Team (vested)", pct: 14, color: "oklch(0.7 0.22 25)" },
  { name: "Liquidity", pct: 8, color: "oklch(0.75 0.18 200)" },
  { name: "Advisors", pct: 4, color: "oklch(0.65 0.05 270)" },
];

function Tokenomics() {
  const burned = useLivePrice(42_180_000, 0.0005);
  const supply = 1_000_000_000;
  const circ = useLivePrice(384_000_000, 0.0002);

  let cumulative = 0;
  return (
    <>
      <PageHeader eyebrow="Transparency Hub" title="Tokenomics & Live Burn" description="Real-time supply transparency. Every protocol revenue dollar buys & burns $PROPHET." />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Supply" value={fmt(supply, 0)} />
        <StatCard label="Circulating" value={fmt(circ, 1)} delta={{ value: "+0.04%", positive: true }} />
        <StatCard label="Burned · all-time" value={`$${fmt(burned, 1)}`} delta={{ value: "+0.6%", positive: true }} icon={<Flame className="h-4 w-4" />} />
        <StatCard label="Locked / Vested" value="38%" />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <SectionTitle title="Allocation" hint="Genesis distribution" />
          <div className="flex items-center gap-6">
            <svg viewBox="0 0 36 36" className="h-44 w-44 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="oklch(1 0 0 / 0.05)" strokeWidth="3.4" />
              {ALLOC.map((a) => {
                const dash = `${a.pct} ${100 - a.pct}`;
                const offset = 100 - cumulative;
                cumulative += a.pct;
                return (
                  <circle key={a.name} cx="18" cy="18" r="15.9" fill="none" stroke={a.color} strokeWidth="3.4" strokeDasharray={dash} strokeDashoffset={offset} pathLength={100} />
                );
              })}
            </svg>
            <ul className="flex-1 space-y-2 text-xs">
              {ALLOC.map((a) => (
                <li key={a.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: a.color }} />{a.name}</span>
                  <span className="font-semibold tabular-nums">{a.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>

        <GlassCard glow>
          <SectionTitle icon={<Flame className="h-4 w-4" />} title="Live Burn Tracker" hint="Buyback & burn · realtime" />
          <Spark seed={77} height={180} color="var(--danger)" />
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-border bg-surface-1/40 p-3"><div className="text-muted-foreground">Last 24h burn</div><div className="mt-1 text-base font-semibold text-[color:var(--danger)]">${fmt(burned * 0.002, 1)}</div></div>
            <div className="rounded-lg border border-border bg-surface-1/40 p-3"><div className="text-muted-foreground">Revenue routed</div><div className="mt-1 text-base font-semibold text-[color:var(--success)]">100%</div></div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}