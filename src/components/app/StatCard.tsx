import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: {
    value: string;
    positive: boolean;
  };
  icon: React.ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  className = "",
}: StatCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface-1/40 p-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {icon}
          <span className="font-semibold">{label}</span>
        </div>
        {delta && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            delta.positive ? "text-success" : "text-destructive"
          )}>
            <span>{delta.value}</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}