import { useTicker, randomActivity } from "@/lib/mock";

export function LiveTicker() {
  const tick = useTicker(2000);
  const items = Array.from({ length: 16 }, (_, i) => randomActivity(tick + i));
  return (
    <div className="overflow-hidden rounded-full border border-border bg-surface-1/60 backdrop-blur">
      <div className="flex w-max gap-8 animate-ticker py-2 pl-4">
        {[...items, ...items].map((it, i) => (
          <div key={i} className="flex items-center gap-2 whitespace-nowrap text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--chain)] chain-glow" />
            <span className="font-mono text-muted-foreground">{it.wallet}</span>
            <span className="text-foreground/80">{it.verb}</span>
            <span className="font-semibold text-[color:var(--chain)]">
              {it.amount} {it.token}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}