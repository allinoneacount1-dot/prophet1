import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { StatCard } from "@/components/app/StatCard";
import { Spark } from "@/components/app/Spark";
import { Activity, Users, DollarSign, Flame } from "lucide-react";
import { useLivePrice, fmt, fmtUsd } from "@/lib/mock";
import { CHAINS } from "@/lib/chain";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Prophet" }] }),
  component: Analytics,
});

function Analytics() {
  const tvl = useLivePrice(284_320_000, 0.001);
  const rev = useLivePrice(2_840_000, 0.002);
  const users = useLivePrice(384_120, 0.0008);
  return (
    <>
      <PageHeader
        eyebrow="Analytics"
        title="Protocol Analytics"
        description="TVL, revenue, user growth, and chain distribution across the entire ecosystem."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="TVL"
          value={fmtUsd(tvl)}
          delta={{ value: "+2.4%", positive: true }}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label="Revenue · 30d"
          value={fmtUsd(rev)}
          delta={{ value: "+18%", positive: true }}
          icon={<Activity className="h-4 w-4" />}
        />
        <StatCard
          label="Active Users"
          value={fmt(users, 1)}
          delta={{ value: "+1.2%", positive: true }}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard label="Burn Rate" value="42.1 / hr" icon={<Flame className="h-4 w-4" />} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-2 text-sm font-semibold">TVL Trend</div>
          <Spark seed={5} height={200} />
        </GlassCard>
        <GlassCard>
          <div className="mb-2 text-sm font-semibold">Daily Active Users</div>
          <Spark seed={6} height={200} color="var(--success)" />
        </GlassCard>
      </div>

      <div className="mt-8">
        <GlassCard>
          <div className="mb-4 text-sm font-semibold">Chain Distribution</div>
          <div className="space-y-3">
            {CHAINS.map((c, i) => {
              const pct = [42, 28, 18, 12][i];
              return (
                <div key={c.id}>
                  <div className="flex justify-between text-xs">
                    <span>{c.label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: c.color,
                        boxShadow: `0 0 12px ${c.color}`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
