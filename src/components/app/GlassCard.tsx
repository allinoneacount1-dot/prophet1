import type { ReactNode } from "react";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileHover={glow ? { y: -4, scale: 1.01 } : { y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "glass rounded-2xl p-6 transition-all",
        glow && "hover:chain-glow hover:-translate-y-0.5",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
