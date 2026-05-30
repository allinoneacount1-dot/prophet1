import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { StatCard } from "@/components/app/StatCard";
import { Award, Copy, Crown, Users } from "lucide-react";
import { toast } from "sonner";
import { useChain, shortAddr } from "@/lib/chain";

export const Route = createFileRoute("/_app/socialfi")({
  head: () => ({ meta: [{ title: "SocialFi — Prophet" }] }),
  component: SocialFi,
});

const LEADERS = [
  { rank: 1, name: "0xWhale.sol", xp: 124820, badge: "Alpha Prophet" },
  { rank: 2, name: "vault.eth", xp: 98430, badge: "Diamond Hands" },
  { rank: 3, name: "neon.bnb", xp: 87211, badge: "Network Pioneer" },
  { rank: 4, name: "oracle.sol", xp: 76112, badge: "Smart Money" },
  { rank: 5, name: "drift.base", xp: 65800, badge: "Early Adopter" },
];

const BADGES = [
  { name: "Alpha Prophet", desc: "Shared 50+ winning signals" },
  { name: "Diamond Hands", desc: "Held $PROPHET 180+ days" },
  { name: "Network Pioneer", desc: "Joined in genesis cohort" },
  { name: "Vault Architect", desc: "Deployed 3+ AI vaults" },
  { name: "DAO Citizen", desc: "Voted on 25+ proposals" },
  { name: "DePIN Builder", desc: "Operates 5+ nodes" },
];

function SocialFi() {
  const { address } = useChain();
  const code = (address ?? "PROPHET1234").slice(-8).toUpperCase();
  return (
    <>
      <PageHeader
        eyebrow="SocialFi"
        title="Community · Growth · Reputation"
        description="Earn XP, climb ranks, collect badges, and invite friends to grow the Prophet network."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Your Rank"
          value="#384"
          delta={{ value: "+12", positive: true }}
          icon={<Crown className="h-4 w-4" />}
        />
        <StatCard label="Total XP" value="18,420" icon={<Award className="h-4 w-4" />} />
        <StatCard label="Friends Joined" value="24" icon={<Users className="h-4 w-4" />} />
        <StatCard
          label="Bonus Earned"
          value="2,140 $PROPHET"
          delta={{ value: "+82", positive: true }}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <SectionTitle
            icon={<Crown className="h-4 w-4" />}
            title="Global Leaderboard"
            hint="Updated every block"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="py-2">#</th>
                  <th>User</th>
                  <th>XP</th>
                  <th>Badge</th>
                </tr>
              </thead>
              <tbody>
                {LEADERS.map((l) => (
                  <tr key={l.rank} className="border-t border-border">
                    <td className="py-3 font-semibold text-[color:var(--chain)]">#{l.rank}</td>
                    <td>{l.name}</td>
                    <td className="tabular-nums">{l.xp.toLocaleString()}</td>
                    <td>
                      <span className="rounded-full bg-[color:var(--chain)]/15 px-2 py-0.5 text-[11px] text-[color:var(--chain)]">
                        {l.badge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard glow>
          <SectionTitle icon={<Users className="h-4 w-4" />} title="Invite to Earn" />
          <div className="rounded-xl border border-border bg-surface-1/40 p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Your code
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="font-mono text-lg text-[color:var(--chain)]">{code}</span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(code);
                  toast.success("Code copied");
                }}
                className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:chain-glow"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Earn 10% of each invitee's first-month protocol fees and 250 XP per signup.{" "}
            {address && <span className="block mt-1 font-mono">{shortAddr(address)}</span>}
          </p>
          <button
            onClick={() => toast.success("Share link copied")}
            className="mt-4 h-10 w-full rounded-lg bg-[linear-gradient(135deg,var(--prophet),var(--chain))] text-xs font-semibold text-primary-foreground"
          >
            Share invite
          </button>
        </GlassCard>
      </div>

      <div className="mt-8">
        <SectionTitle
          icon={<Award className="h-4 w-4" />}
          title="Achievement Badges"
          hint="Earned through activity"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((b) => (
            <GlassCard key={b.name}>
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] chain-glow text-primary-foreground">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.desc}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </>
  );
}
