import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { StatCard } from "@/components/app/StatCard";
import { Vote, MessagesSquare, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/governance")({
  head: () => ({ meta: [{ title: "Governance — ProphetSol" }] }),
  component: Gov,
});

const PROPS = [
  { id: "PIP-024", title: "Activate cross-chain fee discount for $PROPHET stakers", for: 78, ag: 22, status: "Active", end: "3d 12h" },
  { id: "PIP-023", title: "Deploy DePIN incentives in Latin America region", for: 64, ag: 36, status: "Active", end: "1d 4h" },
  { id: "PIP-022", title: "Allocate 5M $PROPHET to AI Vault liquidity bootstrap", for: 92, ag: 8, status: "Passed", end: "Closed" },
];

function Gov() {
  return (
    <>
      <PageHeader eyebrow="Decision Room" title="Governance · DAO" description="Vote on protocol upgrades and shape the ProphetSol roadmap." />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Voters" value="14,824" icon={<Users className="h-4 w-4" />} />
        <StatCard label="Active Proposals" value="2" icon={<Vote className="h-4 w-4" />} />
        <StatCard label="Your Voting Power" value="124,000 vePROPHET" />
        <StatCard label="Quorum" value="68%" delta={{ value: "Met", positive: true }} />
      </div>

      <div className="mt-8 space-y-4">
        {PROPS.map((p) => (
          <GlassCard key={p.id} glow>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-[color:var(--chain)]/15 px-2 py-0.5 text-[color:var(--chain)]">{p.id}</span>
                  <span className={`rounded-full px-2 py-0.5 ${p.status === "Active" ? "bg-[color:var(--success)]/15 text-[color:var(--success)]" : "bg-muted/40 text-muted-foreground"}`}>{p.status}</span>
                  <span className="text-muted-foreground">Ends: {p.end}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
              </div>
              {p.status === "Active" && (
                <div className="flex gap-2">
                  <button onClick={() => toast.success(`Voted FOR ${p.id}`)} className="rounded-lg bg-[color:var(--success)]/20 px-4 py-2 text-xs font-semibold text-[color:var(--success)] hover:scale-[1.02]">Vote For</button>
                  <button onClick={() => toast(`Voted AGAINST ${p.id}`)} className="rounded-lg bg-[color:var(--danger)]/20 px-4 py-2 text-xs font-semibold text-[color:var(--danger)] hover:scale-[1.02]">Against</button>
                </div>
              )}
            </div>
            <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-surface-2">
              <div className="bg-[color:var(--success)]" style={{ width: `${p.for}%` }} />
              <div className="bg-[color:var(--danger)]" style={{ width: `${p.ag}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span><b className="text-[color:var(--success)]">{p.for}%</b> For</span>
              <span><b className="text-[color:var(--danger)]">{p.ag}%</b> Against</span>
            </div>
            <details className="mt-4 text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground"><MessagesSquare className="mr-1 inline h-3 w-3" /> 24 comments</summary>
              <div className="mt-2 space-y-2 rounded-lg border border-border bg-surface-1/40 p-3">
                <div><b className="text-[color:var(--chain)]">whale.sol</b>: "+1 for the fee discount, this aligns long-term holders."</div>
                <div><b className="text-[color:var(--chain)]">drift.eth</b>: "Concerned about emissions. Let's cap at 2M/quarter."</div>
              </div>
            </details>
          </GlassCard>
        ))}
      </div>
    </>
  );
}