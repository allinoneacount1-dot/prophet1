import { useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { toast } from "sonner";

const FROM_TOKENS = ["SOL", "USDC", "BNB", "ETH"];
const TO_TOKENS = ["PROPHET", "USDC", "SOL", "JUP"];

export function SwapWidget() {
  const [from, setFrom] = useState("SOL");
  const [to, setTo] = useState("PROPHET");
  const [amt, setAmt] = useState("1.0");

  const estimated = (parseFloat(amt || "0") * 64.2).toFixed(2);

  return (
    <GlassCard glow>
      <SectionTitle
        icon={<ArrowDownUp className="h-4 w-4" />}
        title="Swap"
        hint="Jupiter / Uniswap"
      />
      <div className="space-y-3">
        {/* From */}
        <div className="rounded-xl border border-border bg-surface-1/40 p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            From
          </div>
          <div className="mt-1 flex items-center justify-between">
            <input
              value={amt}
              onChange={(e) => setAmt(e.target.value)}
              className="w-full bg-transparent text-2xl font-semibold tabular-nums outline-none"
            />
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-lg border border-border bg-surface-2/60 px-2 py-1 text-sm"
            >
              {FROM_TOKENS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={() => { const t = from; setFrom(to); setTo(t); }}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface-1 hover:chain-glow"
          >
            <ArrowDownUp className="h-4 w-4" />
          </button>
        </div>

        {/* To */}
        <div className="rounded-xl border border-border bg-surface-1/40 p-3">
          <div className="text-xs text-muted-foreground">To (estimated)</div>
          <div className="mt-1 flex items-center justify-between">
            <div className="text-2xl font-semibold tabular-nums text-[color:var(--chain)]">
              {estimated}
            </div>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-lg border border-border bg-surface-2/60 px-2 py-1 text-sm"
            >
              {TO_TOKENS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() =>
            toast.success("Swap submitted", { description: `${amt} ${from} → ${to}` })
          }
          className="h-11 w-full rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] font-semibold text-primary-foreground"
        >
          Swap
        </motion.button>
      </div>
    </GlassCard>
  );
}