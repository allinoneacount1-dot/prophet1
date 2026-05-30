import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function BuyProphetButton({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sz =
    size === "sm"
      ? "h-9 px-3 text-xs"
      : size === "lg"
        ? "h-14 px-7 text-base"
        : "h-11 px-5 text-sm";
  return (
    <button
      onClick={() =>
        toast.success("Opening $PROPHET swap…", {
          description: "Routing through Jupiter aggregator for best price.",
        })
      }
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-full font-semibold tracking-wide",
        "text-primary-foreground",
        "bg-[linear-gradient(135deg,var(--prophet),var(--chain))]",
        "animate-prophet-pulse transition-transform hover:scale-[1.03] active:scale-95",
        sz,
        className,
      )}
    >
      <Sparkles className="h-4 w-4" />
      Buy $PROPHET
      <span className="ml-1 rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-bold backdrop-blur">
        +12.4%
      </span>
    </button>
  );
}
