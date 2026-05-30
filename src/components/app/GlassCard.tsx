import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  glow,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 transition-all",
        glow && "hover:chain-glow hover:-translate-y-0.5",
        className,
      )}
    >
      {children}
    </div>
  );
}