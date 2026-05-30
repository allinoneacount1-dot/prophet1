import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { Switch } from "@/components/ui/switch";
import { CHAINS, useChain, WALLETS } from "@/lib/chain";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — ProphetSol" }] }),
  component: Settings,
});

function Settings() {
  const { chain, setChain } = useChain();
  type NotifKey = "ai" | "stake" | "gov" | "friends";
  const [n, setN] = useState<Record<NotifKey, boolean>>({ ai: true, stake: true, gov: false, friends: true });
  return (
    <>
      <PageHeader eyebrow="Settings" title="Preferences & Security" description="Manage wallets, notifications, theme, and devices." />
      <div className="grid gap-4 md:grid-cols-2">
        <GlassCard>
          <div className="mb-4 text-sm font-semibold">Wallet Management</div>
          <div className="space-y-2 text-sm">
            {WALLETS.map((w) => (
              <div key={w.id} className="flex items-center justify-between rounded-lg border border-border bg-surface-1/40 p-3">
                <span>{w.label}</span>
                <button onClick={() => toast.success(`${w.label} reconnected`)} className="text-xs text-[color:var(--chain)]">Reconnect</button>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <div className="mb-4 text-sm font-semibold">Notification Preferences</div>
          <div className="space-y-3 text-sm">
            {[
              ["AI Alerts", "ai" as const],
              ["Staking Rewards", "stake" as const],
              ["Governance Updates", "gov" as const],
              ["Friend Activities", "friends" as const],
            ].map(([label, key]) => (
              <div key={key} className="flex items-center justify-between">
                <span>{label}</span>
                <Switch checked={n[key]} onCheckedChange={(v) => setN({ ...n, [key]: v })} />
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <div className="mb-4 text-sm font-semibold">Active Chain</div>
          <div className="grid grid-cols-2 gap-2">
            {CHAINS.map((c) => (
              <button key={c.id} onClick={() => setChain(c.id)} className={`rounded-lg border p-3 text-left text-sm ${chain === c.id ? "border-[color:var(--chain)] chain-glow" : "border-border bg-surface-1/40"}`}>
                <span className="block font-semibold">{c.label}</span>
                <span className="text-xs text-muted-foreground">{c.symbol}</span>
              </button>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <div className="mb-4 text-sm font-semibold">Connected Devices</div>
          <ul className="space-y-2 text-sm">
            {[
              ["MacBook Pro · Chrome", "Jakarta · active now"],
              ["iPhone 16 · Safari", "Jakarta · 2h ago"],
              ["Telegram Mini App", "Mobile · 1d ago"],
            ].map(([d, s]) => (
              <li key={d} className="flex items-center justify-between rounded-lg border border-border bg-surface-1/40 p-3">
                <span>{d}<div className="text-xs text-muted-foreground">{s}</div></span>
                <button onClick={() => toast(`Signed out: ${d}`)} className="text-xs text-[color:var(--danger)]">Sign out</button>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </>
  );
}