import { fmtUsd } from "@/lib/mock";
import { CHAINS } from "@/lib/chain";

interface ChainAllocationProps {
  allocations: { id: string; label: string; color: string; value: number }[];
}

export function ChainAllocation({ allocations }: ChainAllocationProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {allocations.map((alloc) => (
        <div key={alloc.id} className="rounded-lg border border-border bg-surface-1/40 p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span className={`h-1.5 w-1.5 rounded-full`} style={{ background: alloc.color }} />
            {alloc.label}
          </div>
          <div className="mt-1 font-semibold tabular-nums">{fmtUsd(alloc.value)}</div>
        </div>
      ))}
    </div>
  );
}