import type { ReactNode } from "react";
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
    <div
      className={cn(
        "glass rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:chain-glow",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        {icon && <div className="text-[color:var(--chain)]">{icon}</div>}
      </div>
      <div className="mt-3 text-2xl font-semibold tabular-nums">{value}</div>
      {delta && (
        <div
          className={cn(
            "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            delta.positive
              ? "bg-[oklch(0.78_0.2_150/0.15)] text-[oklch(0.85_0.2_150)]"
              : "bg-[oklch(0.7_0.22_25/0.15)] text-[oklch(0.8_0.22_25)]",
          )}
        >
          {delta.positive ? "▲" : "▼"} {delta.value}
        </div>
      )}
    </div>
  );
}