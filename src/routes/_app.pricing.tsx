import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/pricing")({
  head: () => ({ meta: [{ title: "Pricing — Prophet" }] }),
  component: Pricing,
});

const TIERS = [
  {
    name: "Free",
    price: "$0",
    desc: "For curious users",
    feats: ["Basic AI signals", "Portfolio tracking", "Community access"],
    cta: "Current plan",
  },
  {
    name: "Pro",
    price: "20K $PROPHET / mo",
    desc: "For active traders",
    feats: ["Early Gem Radar", "AI Copilot", "Smart Money detection", "Priority signals"],
    cta: "Stake to upgrade",
    featured: true,
  },
  {
    name: "Elite",
    price: "100K $PROPHET / mo",
    desc: "For power users",
    feats: ["Automated Vaults", "Whale Alerts", "Alpha Feed Priority", "All PRO features"],
    cta: "Stake to upgrade",
  },
  {
    name: "Institutional",
    price: "Custom",
    desc: "For funds & teams",
    feats: ["API Access", "Team accounts", "Advanced Analytics", "Dedicated support"],
    cta: "Contact sales",
  },
];

function Pricing() {
  return (
    <>
      <PageHeader
        eyebrow="Subscription"
        title="Premium DeAI Tiers"
        description="Stake $PROPHET to unlock progressively powerful AI tooling. Cancel anytime."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {TIERS.map((t) => (
          <GlassCard
            key={t.name}
            glow={t.featured}
            className={t.featured ? "border-[color:var(--chain)] chain-glow" : ""}
          >
            {t.featured && (
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[color:var(--chain)]">
                Most popular
              </div>
            )}
            <div className="text-lg font-bold">{t.name}</div>
            <div className="text-xs text-muted-foreground">{t.desc}</div>
            <div className="mt-4 text-2xl font-semibold">{t.price}</div>
            <ul className="mt-4 space-y-2 text-sm">
              {t.feats.map((f) => (
                <li key={f} className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-[color:var(--chain)]" /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => toast.success(`${t.name} flow opened`)}
              className={`mt-6 h-10 w-full rounded-lg text-xs font-semibold ${t.featured ? "bg-[linear-gradient(135deg,var(--prophet),var(--chain))] text-primary-foreground" : "border border-border bg-surface-1/60 text-foreground hover:bg-white/5"}`}
            >
              {t.cta}
            </button>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
