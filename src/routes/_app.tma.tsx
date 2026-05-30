import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { Send, Users, Sparkles } from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { Spark } from "@/components/app/Spark";

export const Route = createFileRoute("/_app/tma")({
  head: () => ({ meta: [{ title: "Telegram Mini App — ProphetSol" }] }),
  component: TMA,
});

function TMA() {
  return (
    <>
      <PageHeader eyebrow="TMA Preview Hub" title="ProphetSol · Telegram Mini App" description="Designed for 800M+ Telegram users. Connect, swap, and stake from inside a chat." />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="TMA Users (beta)" value="184K" delta={{ value: "+8.4K / day", positive: true }} icon={<Users className="h-4 w-4" />} />
        <StatCard label="One-Click Connects" value="142,000" icon={<Sparkles className="h-4 w-4" />} />
        <StatCard label="Bot Commands /day" value="2.1M" icon={<Send className="h-4 w-4" />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="mx-auto w-full max-w-[360px]">
          <div className="rounded-[40px] border border-border bg-surface-1/60 p-3 shadow-[0_30px_80px_-20px_oklch(0_0_0/0.6)]">
            <div className="overflow-hidden rounded-[30px] border border-border bg-background">
              <div className="flex items-center justify-between bg-surface-2 px-4 py-3 text-xs">
                <span className="text-muted-foreground">9:41</span>
                <span className="font-semibold">@ProphetSolBot</span>
                <span className="text-muted-foreground">•••</span>
              </div>
              <div className="space-y-3 p-4">
                <div className="rounded-2xl border border-[color:var(--chain)]/30 bg-[color:var(--chain)]/10 p-3 text-xs">
                  <div className="font-semibold text-[color:var(--chain)]">ProphetSol</div>
                  <div className="mt-1">Welcome, Anon. Your Smart Account is ready.</div>
                </div>
                <div className="rounded-2xl border border-border bg-surface-1/60 p-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Portfolio</div>
                  <div className="mt-1 text-2xl font-semibold text-[color:var(--chain)]">$1,284.20</div>
                  <Spark seed={9} height={48} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  {["Swap", "Stake", "Invite"].map((b) => (
                    <button key={b} className="rounded-xl border border-border bg-surface-1/60 p-3 font-semibold">{b}</button>
                  ))}
                </div>
                <div className="rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] py-3 text-center text-xs font-bold text-primary-foreground">
                  Buy $PROPHET
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <GlassCard>
            <h3 className="text-base font-semibold">One-click wallet connect</h3>
            <p className="mt-1 text-sm text-muted-foreground">Provision a Smart Account & gasless transactions inside the chat — no popups, no extensions.</p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-base font-semibold">Telegram Referral Engine</h3>
            <p className="mt-1 text-sm text-muted-foreground">Native invite tracking, viral coefficients, and tier rewards.</p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-base font-semibold">Mobile-first dashboard</h3>
            <p className="mt-1 text-sm text-muted-foreground">Portfolio, DeAI signals, staking, and swaps — optimized for thumbs.</p>
          </GlassCard>
        </div>
      </div>
    </>
  );
}