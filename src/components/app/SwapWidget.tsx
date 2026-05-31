import { useState, useMemo } from "react";
import { ArrowDownUp } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { useNativeWallet } from "@/lib/use-native-wallet";
import { useJupiterQuote } from "@/lib/useOnchain";
import { TOKEN_MINTS } from "@/lib/onchain";
import { toast } from "sonner";

// Token metadata for Jupiter
const TOKEN_META: Record<string, { mint: string; decimals: number; symbol: string }> = {
  SOL: { mint: "So11111111111111111111111111111111111111112", decimals: 9, symbol: "SOL" },
  USDC: { mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6, symbol: "USDC" },
  BNB: { mint: "9gP2kCy3wA1ctvYWQk75guqXuHfrEomqydHLtcTCqiLa", decimals: 8, symbol: "BNB" },
  ETH: { mint: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs", decimals: 8, symbol: "ETH" },
  JUP: { mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", decimals: 6, symbol: "JUP" },
  WIF: { mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", decimals: 6, symbol: "WIF" },
  BONK: { mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", decimals: 5, symbol: "BONK" },
};

const FROM_TOKENS = ["SOL", "USDC", "ETH", "JUP"];
const TO_TOKENS = ["USDC", "SOL", "JUP", "WIF", "BONK"];

function safeNum(v: string): number {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

export function SwapWidget() {
  const { connected } = useNativeWallet();
  const [from, setFrom] = useState("SOL");
  const [to, setTo] = useState("USDC");
  const [amt, setAmt] = useState("");
  const [swapping, setSwapping] = useState(false);

  const numAmt = safeNum(amt);
  const fromMeta = TOKEN_META[from];
  const toMeta = TOKEN_META[to];

  const { data: quote, isLoading: quoting, error: quoteError } = useJupiterQuote(
    fromMeta?.mint || null,
    toMeta?.mint || null,
    numAmt,
    fromMeta?.decimals || 9
  );

  const estimated = useMemo(() => {
    if (quote?.outAmount && toMeta) {
      return (quote.outAmount / Math.pow(10, toMeta.decimals)).toFixed(4);
    }
    if (numAmt > 0 && !quote && !quoting) {
      return "—";
    }
    return "—";
  }, [quote, toMeta, numAmt, quoting]);

  const priceImpact = quote?.priceImpactPct;
  const route = quote?.routePlan?.map((r) => r.swapInfo?.label).filter(Boolean).join(" → ");

  const doSwap = async () => {
    if (!connected) {
      toast.error("Connect wallet first");
      return;
    }
    if (!quote || numAmt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setSwapping(true);
    try {
      toast.info("Jupiter swap ready", {
        description: `${numAmt} ${from} → ${estimated} ${to}. Full swap requires wallet signing.`,
      });
    } catch (e: any) {
      toast.error(e.message || "Swap failed");
    } finally {
      setSwapping(false);
    }
  };

  return (
    <GlassCard glow>
      <SectionTitle
        icon={<ArrowDownUp className="h-4 w-4" />}
        title="Swap"
        hint="Jupiter Aggregator · Solana"
      />
      <div className="space-y-3">
        {/* From */}
        <div className="rounded-xl border border-border bg-surface-1/40 p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>From</span>
            <span className="text-[10px]">Balance: connect wallet</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <input
              value={amt}
              onChange={(e) => setAmt(e.target.value)}
              placeholder="0.0"
              type="number"
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

        {/* Swap direction button */}
        <div className="flex justify-center">
          <button
            onClick={() => { const t = from; setFrom(to); setTo(t); setAmt(""); }}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface-1 hover:chain-glow"
          >
            <ArrowDownUp className="h-4 w-4" />
          </button>
        </div>

        {/* To */}
        <div className="rounded-xl border border-border bg-surface-1/40 p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>To (estimated)</span>
            {quoting && <span className="animate-pulse">Fetching...</span>}
          </div>
          <div className="mt-1 flex items-center justify-between">
            <div className="text-2xl font-semibold tabular-nums text-[color:var(--chain)]">
              {estimated}
            </div>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-lg border border-border bg-surface-2/60 px-2 py-1 text-sm"
            >
              {TO_TOKENS.filter((t) => t !== from).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quote info */}
        {quote && (
          <div className="rounded-lg bg-surface-1/40 p-2 text-[11px] text-muted-foreground space-y-1">
            {priceImpact !== undefined && (
              <div className="flex justify-between">
                <span>Price Impact</span>
                <span className={Number(priceImpact) > 3 ? "text-warning" : "text-success"}>
                  {Number(priceImpact).toFixed(2)}%
                </span>
              </div>
            )}
            {route && (
              <div className="flex justify-between">
                <span>Route</span>
                <span className="text-foreground/70 truncate max-w-[140px]">{route}</span>
              </div>
            )}
          </div>
        )}

        {quoteError && (
          <div className="rounded-lg bg-red-500/10 p-2 text-[11px] text-red-400">
            Quote unavailable. Try a different pair or amount.
          </div>
        )}

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={doSwap}
          disabled={!connected || swapping || !quote || numAmt <= 0}
          className="h-11 w-full rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] font-semibold text-primary-foreground disabled:opacity-50"
        >
          {!connected ? "Connect Wallet" : swapping ? "Swapping..." : "Swap via Jupiter"}
        </motion.button>
      </div>
    </GlassCard>
  );
}
