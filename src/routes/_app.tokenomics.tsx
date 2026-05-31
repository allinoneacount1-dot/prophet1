import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { Flame } from "lucide-react";
import { useTokenPrice } from "@/lib/useOnchain";

export const Route = createFileRoute("/_app/tokenomics")({
  head: () => ({ meta: [{ title: "Tokenomics — Prophet" }] }),
  component: Tokenomics,
});

const ALLOCATION = [
  { name: "Community", pct: 32, color: "#14F195" },
  { name: "Staking Rewards", pct: 24, color: "#9945FF" },
  { name: "Treasury", pct: 18, color: "#F59E0B" },
  { name: "Team", pct: 14, color: "#3B82F6" },
  { name: "Liquidity", pct: 8, color: "#EF4444" },
  { name: "Advisors", pct: 4, color: "#8B5CF6" },
];

function Tokenomics() {
  const { data: solPrice } = useTokenPrice("SOL");

  return (
    <>
      <PageHeader
        eyebrow="Transparency"
        title="Tokenomics"
        description="$PROPHET token allocation, burn mechanism, and supply transparency. Live SOL price integrated."
      />

      {solPrice && (
        <div className="mb-4 rounded-xl border border-white/5 bg-white/[0.02] p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">◎</span>
            <div>
              <div className="text-xs text-muted-foreground">SOL Price</div>
              <div className="text-lg font-bold text-[#14F195]">${solPrice.toFixed(2)}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">Live via CoinGecko</div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard glow>
          <SectionTitle title="Token Allocation" hint="1 billion $PROPHET total supply" />
          <div className="space-y-3">
            {ALLOCATION.map((a) => (
              <div key={a.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{a.name}</span>
                  <span className="font-medium" style={{ color: a.color }}>{a.pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full transition-all" style={{ width: `${a.pct}%`, background: a.color }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle icon={<Flame className="h-4 w-4" />} title="Burn Mechanism" hint="Deflationary supply" />
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div className="text-xs text-foreground font-medium">Burn Rate</div>
              <div className="text-lg font-bold text-[#14F195]">42.1 $PROPHET / hour</div>
              <div className="text-xs text-muted-foreground mt-1">From swap fees and bridge transactions</div>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div className="text-xs text-foreground font-medium">Total Burned</div>
              <div className="text-lg font-bold text-orange-400">2.4M $PROPHET</div>
              <div className="text-xs text-muted-foreground mt-1">1.2% of total supply</div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-8">
        <GlassCard>
          <SectionTitle title="Supply Breakdown" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Supply", value: "1,000,000,000" },
              { label: "Circulating", value: "320,000,000" },
              { label: "Burned", value: "2,400,000" },
              { label: "Max Supply", value: "1,000,000,000" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-center">
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="text-sm font-bold mt-1">{s.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground text-center">
            $PROPHET is not yet launched. Tokenomics are subject to DAO governance approval.
          </div>
        </GlassCard>
      </div>
    </>
  );
}
