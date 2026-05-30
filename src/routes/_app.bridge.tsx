import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { CHAINS } from "@/lib/chain";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/bridge")({
  head: () => ({ meta: [{ title: "Bridge — ProphetSol" }] }),
  component: Bridge,
});

function Bridge() {
  const [from, setFrom] = useState("solana");
  const [to, setTo] = useState("base");
  const [amt, setAmt] = useState("100");
  return (
    <>
      <PageHeader eyebrow="Cross-Chain Hub" title="Bridge" description="Move assets across Solana, BNB, Base, and Ethereum — routed through Li.Fi & Wormhole." />
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard glow>
          <SectionTitle title="Transfer assets" />
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-surface-1/40 p-3">
              <div className="text-xs text-muted-foreground">From</div>
              <div className="mt-2 flex items-center gap-2">
                <select value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg border border-border bg-surface-2/60 px-2 py-1 text-sm">
                  {CHAINS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <input value={amt} onChange={(e) => setAmt(e.target.value)} className="flex-1 bg-transparent text-right text-2xl font-semibold tabular-nums outline-none" />
                <span className="text-sm text-muted-foreground">USDC</span>
              </div>
            </div>
            <div className="flex justify-center"><div className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface-1"><ArrowRight className="h-4 w-4 rotate-90" /></div></div>
            <div className="rounded-xl border border-border bg-surface-1/40 p-3">
              <div className="text-xs text-muted-foreground">To (estimated)</div>
              <div className="mt-2 flex items-center gap-2">
                <select value={to} onChange={(e) => setTo(e.target.value)} className="rounded-lg border border-border bg-surface-2/60 px-2 py-1 text-sm">
                  {CHAINS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <div className="flex-1 text-right text-2xl font-semibold tabular-nums text-[color:var(--chain)]">{(parseFloat(amt || "0") * 0.998).toFixed(2)}</div>
                <span className="text-sm text-muted-foreground">USDC</span>
              </div>
            </div>
            <div className="rounded-lg bg-surface-1/40 p-3 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>Route</span><span className="text-foreground">Wormhole · 2 hops</span></div>
              <div className="mt-1 flex justify-between"><span>Estimated time</span><span className="text-foreground">~ 38s</span></div>
              <div className="mt-1 flex justify-between"><span>Fee</span><span className="text-foreground">0.2%</span></div>
            </div>
            <button onClick={() => toast.success("Bridge initiated", { description: "Watching for finality on destination chain." })} className="h-11 w-full rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] font-semibold text-primary-foreground">Bridge</button>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Recent bridges" />
          <ul className="divide-y divide-border text-sm">
            {[
              { f: "Solana", t: "Base", a: "240 USDC", s: "Complete" },
              { f: "BNB", t: "Ethereum", a: "0.4 ETH", s: "Complete" },
              { f: "Base", t: "Solana", a: "1,200 $PROPHET", s: "Pending" },
            ].map((b, i) => (
              <li key={i} className="flex items-center justify-between py-3">
                <span className="flex items-center gap-2"><span>{b.f}</span><ArrowRight className="h-3 w-3 text-muted-foreground" /><span>{b.t}</span></span>
                <span className="tabular-nums">{b.a}</span>
                <span className={`text-xs ${b.s === "Complete" ? "text-[color:var(--success)]" : "text-[color:var(--warning)]"}`}>{b.s}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </>
  );
}