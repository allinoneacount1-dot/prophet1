import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { Sparkles, Send, Search, Wallet } from "lucide-react";

export const Route = createFileRoute("/_app/copilot")({
  head: () => ({ meta: [{ title: "AI Copilot — ProphetSol" }] }),
  component: Copilot,
});

const SUGGESTIONS = [
  "Analyze the smart money flow on $WIF in the last 24h",
  "What's the security score of 0xabc…123?",
  "Summarize today's Solana ecosystem narrative",
  "Investigate this wallet's PnL: 9xK…fQ2",
];

type Msg = { role: "user" | "ai"; text: string };

function Copilot() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "I'm Prophet Copilot. Ask me to investigate wallets, detect narratives, score tokens, or surface alpha." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  function send(q?: string) {
    const txt = (q ?? input).trim();
    if (!txt) return;
    setMsgs((m) => [...m, { role: "user", text: txt }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { role: "ai", text: `Analyzing "${txt}" across 4 chains… Detected 3 whale clusters, sentiment skew +12%, security score 87/100. Recommend cautious entry with 2% portfolio allocation.` },
      ]);
      setThinking(false);
    }, 1100);
  }

  return (
    <>
      <PageHeader eyebrow="Copilot" title="AI Copilot" description="Bloomberg-grade on-chain intelligence at chat speed." />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <GlassCard className="flex h-[600px] flex-col p-0">
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${m.role === "ai" ? "bg-[color:var(--chain)]/15 text-[color:var(--chain)]" : "bg-surface-2"}`}>
                  {m.role === "ai" ? <Sparkles className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "ai" ? "glass" : "bg-[color:var(--chain)]/15 text-foreground"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--chain)]/15 text-[color:var(--chain)]"><Sparkles className="h-4 w-4 animate-pulse" /></div>
                <div className="glass rounded-2xl px-4 py-3 text-sm text-muted-foreground">Streaming reasoning…</div>
              </div>
            )}
          </div>
          <div className="border-t border-border p-4">
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Prophet anything…" className="h-11 w-full rounded-xl border border-border bg-surface-1/60 pl-10 pr-3 text-sm outline-none focus:border-[color:var(--chain)] focus:chain-glow" />
              </div>
              <button type="submit" className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] text-primary-foreground hover:scale-[1.02]">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard>
            <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Suggested Prompts</div>
            <div className="space-y-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="block w-full rounded-lg border border-border bg-surface-1/40 p-3 text-left text-xs text-muted-foreground hover:border-[color:var(--chain)]/40 hover:text-foreground">
                  {s}
                </button>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Wallet Intelligence Scanner</div>
            <input placeholder="0x… or So1…" className="mb-2 h-10 w-full rounded-lg border border-border bg-surface-1/60 px-3 text-xs outline-none focus:border-[color:var(--chain)]" />
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ["Net Worth", "$1.24M"],
                ["Risk Score", "12/100"],
                ["Smart Money", "Tier S"],
                ["Whale Prob.", "84%"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-border bg-surface-1/40 p-3">
                  <div className="text-muted-foreground">{k}</div>
                  <div className="mt-1 font-semibold text-[color:var(--chain)]">{v}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}