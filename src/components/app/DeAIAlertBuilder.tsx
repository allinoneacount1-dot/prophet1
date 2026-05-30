import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { toast } from "sonner";

export function DeAIAlertBuilder() {
  return (
    <GlassCard glow>
      <SectionTitle
        icon={<Plus className="h-4 w-4" />}
        title="DeAI Alert Builder"
        hint="Personal"
      />
      <p className="text-xs text-muted-foreground">
        Create custom AI-powered triggers from on-chain & off-chain signals.
      </p>
      <div className="mt-4 space-y-2 text-sm">
        <div className="rounded-lg border border-border bg-surface-1/40 p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">IF</div>
          <div className="mt-1">
            Token security score on <span className="text-[color:var(--chain)]">Solana</span>{" "}
            ≥ <b>90</b>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface-1/40 p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">THEN</div>
          <div className="mt-1">
            Notify me & open in <span className="text-[color:var(--chain)]">DeAI Hub</span>
          </div>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => toast.success("Alert saved", { description: "We'll ping you on triggers." })}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--chain)]/40 bg-[color:var(--chain)]/10 text-xs font-medium text-[color:var(--chain)]"
      >
        <Plus className="h-3.5 w-3.5" /> Save Alert
      </motion.button>
    </GlassCard>
  );
}