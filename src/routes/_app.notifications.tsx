import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { Brain, Coins, Users, Vote, Sparkles } from "lucide-react";
import { useTicker, randomActivity } from "@/lib/mock";
import { useState } from "react";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Prophet" }] }),
  component: Notif,
});

const TABS = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "ai", label: "AI Alerts", icon: Brain },
  { id: "stake", label: "Staking", icon: Coins },
  { id: "gov", label: "Governance", icon: Vote },
  { id: "friends", label: "Friends", icon: Users },
];

function Notif() {
  const tick = useTicker(2500);
  const [tab, setTab] = useState("all");
  const items = Array.from({ length: 14 }, (_, i) => randomActivity(tick + i * 11));
  return (
    <>
      <PageHeader
        eyebrow="Inbox"
        title="Notification Center"
        description="Realtime alerts streamed from AI, staking, governance, and your network."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${tab === t.id ? "border-[color:var(--chain)] bg-[color:var(--chain)]/15 text-[color:var(--chain)]" : "border-border bg-surface-1/40 text-muted-foreground hover:text-foreground"}`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>
      <GlassCard className="p-0">
        <ul className="divide-y divide-border">
          {items.map((it, i) => (
            <li key={i} className="flex items-start gap-3 px-5 py-4 text-sm hover:bg-white/5">
              <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--chain)] chain-glow" />
              <div className="flex-1">
                <div>
                  <b className="text-foreground">AI signal:</b> {it.token} sentiment surged{" "}
                  <span className="text-[color:var(--success)]">+{it.amount}%</span> — cluster{" "}
                  {it.wallet}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{i + 1}m ago · Solana</div>
              </div>
              <button className="text-xs text-muted-foreground hover:text-foreground">
                Mark read
              </button>
            </li>
          ))}
        </ul>
      </GlassCard>
    </>
  );
}
