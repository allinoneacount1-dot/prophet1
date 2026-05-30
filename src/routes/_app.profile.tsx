import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { StatCard } from "@/components/app/StatCard";
import { Award, Crown, Sparkles } from "lucide-react";
import { useChain, shortAddr } from "@/lib/chain";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — ProphetSol" }] }),
  component: Profile,
});

const RANKS = ["Explorer", "Seeker", "Analyst", "Oracle", "Prophet", "ArchProphet"];

function Profile() {
  const { address, wallet } = useChain();
  const level = 42;
  const xp = 18420;
  const next = 25000;
  const rank = RANKS[Math.min(RANKS.length - 1, Math.floor(level / 20))];
  return (
    <>
      <PageHeader eyebrow="Profile" title="Your Prophet Identity" description="Reputation, scores, and on-chain history aggregated across every connected chain." />

      <GlassCard glow className="overflow-hidden">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative h-20 w-20 shrink-0 rounded-2xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] chain-glow">
            <div className="absolute inset-0 grid place-items-center text-2xl font-black text-primary-foreground">Ψ</div>
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold">Anonymous Prophet</div>
            <div className="font-mono text-xs text-muted-foreground">{address ? shortAddr(address) : "Not connected"} {wallet && `· ${wallet}`}</div>
            <div className="mt-3 flex items-center gap-3">
              <span className="rounded-full bg-[color:var(--chain)]/15 px-2 py-0.5 text-xs text-[color:var(--chain)]">Rank · {rank}</span>
              <span className="text-xs text-muted-foreground">Level {level}</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-muted-foreground"><span>{xp.toLocaleString()} XP</span><span>{next.toLocaleString()} XP</span></div>
              <div className="mt-1 h-2 rounded-full bg-surface-2"><div className="h-full rounded-full bg-[linear-gradient(135deg,var(--prophet),var(--chain))]" style={{ width: `${(xp / next) * 100}%` }} /></div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Wallet Score" value="924 / 1000" icon={<Award className="h-4 w-4" />} />
        <StatCard label="Reputation" value="A+" icon={<Crown className="h-4 w-4" />} />
        <StatCard label="AI Activity" value="High" icon={<Sparkles className="h-4 w-4" />} />
        <StatCard label="DAO Participation" value="84%" />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {["Alpha Prophet", "Diamond Hands", "Network Pioneer"].map((b) => (
          <GlassCard key={b}>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] chain-glow text-primary-foreground"><Award className="h-5 w-5" /></div>
              <div>
                <div className="text-sm font-semibold">{b}</div>
                <div className="text-xs text-muted-foreground">Earned · genesis cohort</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}