import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  delta?: { value: string; positive?: boolean };
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "glass rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:chain-glow",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        {icon && <div className="text-[color:var(--chain)]">{icon}</div>}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 text-2xl font-semibold tabular-nums"
      >
        {value}
      </motion.div>
      {delta && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            delta.positive
              ? "bg-[oklch(0.78_0.2_150/0.15)] text-[oklch(0.85_0.2_150)]"
              : "bg-[oklch(0.7_0.22_25/0.15)] text-[oklch(0.8_0.22_25)]",
          )}
        >
          {delta.positive ? "▲" : "▼"} {delta.value}
        </motion.div>
      )}
    </motion.div>
  );
}
