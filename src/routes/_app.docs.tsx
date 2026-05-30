import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { BookOpen, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/docs")({
  head: () => ({ meta: [{ title: "Docs — ProphetSol" }] }),
  component: Docs,
});

const SECTIONS = [
  { id: "intro", title: "Getting Started", items: ["What is ProphetSol", "Create a Smart Account", "Connect a wallet", "Switch chains"] },
  { id: "solana", title: "Solana Guide", items: ["Connect Phantom", "Stake $PROPHET", "Trade via Jupiter"] },
  { id: "bnb", title: "BNB Chain Guide", items: ["Connect MetaMask", "BNB staking pools", "Cross-chain swaps"] },
  { id: "base", title: "Base Guide", items: ["Connect Base Wallet", "Bridge from Ethereum", "Yield strategies"] },
  { id: "deai", title: "DeAI Tiers", items: ["Free vs Pro", "Pro vs Elite", "Institutional access"] },
  { id: "faq", title: "FAQ", items: ["Is ProphetSol custodial?", "Fee structure", "Token utility", "Security audits"] },
];

function Docs() {
  const [active, setActive] = useState("intro");
  const section = SECTIONS.find((s) => s.id === active)!;
  return (
    <>
      <PageHeader eyebrow="Knowledge Base" title="Documentation" description="Technical docs, integration guides, and step-by-step playbooks." />
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <GlassCard className="h-fit p-4">
          <ul className="space-y-1 text-sm">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button onClick={() => setActive(s.id)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left ${active === s.id ? "bg-[color:var(--chain)]/10 text-[color:var(--chain)]" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}>
                  {s.title} <ChevronRight className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard>
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-[color:var(--chain)]"><BookOpen className="h-4 w-4" /> {section.title}</div>
          <h2 className="text-2xl font-bold">{section.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">Step-by-step guides, examples, and best practices for {section.title.toLowerCase()}.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {section.items.map((it) => (
              <div key={it} className="rounded-xl border border-border bg-surface-1/40 p-4">
                <div className="text-sm font-semibold">{it}</div>
                <div className="mt-1 text-xs text-muted-foreground">Read article · 4 min</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}