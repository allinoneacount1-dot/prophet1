import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { CHAINS } from "@/lib/chain";
import { ArrowRight, Clock, Zap } from "lucide-react";
import { useNativeWallet } from "@/lib/use-native-wallet";
import { useLiFiQuote } from "@/lib/useOnchain";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/bridge")({
  head: () => ({ meta: [{ title: "Bridge — Prophet" }] }),
  component: Bridge,
});

// Li.Fi token addresses per chain
const LIFI_TOKENS: Record<string, Record<string, string>> = {
  solana: { USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", SOL: "So11111111111111111111111111111111111111112" },
  ethereum: { USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", ETH: "0x0000000000000000000000000000000000000000" },
  bnb: { USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", BNB: "0x0000000000000000000000000000000000000000" },
  base: { USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", ETH: "0x0000000000000000000000000000000000000000" },
};

const CHAIN_LABELS: Record<string, string> = {
  solana: "Solana",
  ethereum: "Ethereum",
  bnb: "BNB Chain",
  base: "Base",
};

function Bridge() {
  const { connected } = useNativeWallet();
  const [fromChain, setFromChain] = useState("solana");
  const [toChain, setToChain] = useState("base");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDC");

  const numAmt = parseFloat(amount) || 0;
  const fromTokenAddr = LIFI_TOKENS[fromChain]?.[token] || token;
  const toTokenAddr = LIFI_TOKENS[toChain]?.[token] || token;

  const { data: bridgeQuote, isLoading: bridging, error: bridgeErr } = useLiFiQuote(
    fromChain,
    toChain,
    fromTokenAddr,
    toTokenAddr,
    numAmt
  );

  const handleBridge = () => {
    if (!connected) {
      toast.error("Connect wallet first");
      return;
    }
    if (!bridgeQuote || numAmt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    toast.info("Bridge quote ready", {
      description: `${numAmt} ${token} from ${CHAIN_LABELS[fromChain]} → ${CHAIN_LABELS[toChain]}. Full bridge requires wallet signing.`,
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Cross-Chain Hub"
        title="Bridge"
        description="Move assets across Solana, BNB, Base, and Ethereum — routed through Li.Fi & Wormhole."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard glow>
          <SectionTitle title="Transfer assets" />
          <div className="space-y-3">
            {/* From chain */}
            <div className="rounded-xl border border-border bg-surface-1/40 p-3">
              <div className="text-xs text-muted-foreground">From</div>
              <div className="mt-2 flex items-center gap-2">
                <select
                  value={fromChain}
                  onChange={(e) => setFromChain(e.target.value)}
                  className="rounded-lg border border-border bg-surface-2/60 px-2 py-1 text-sm"
                >
                  {CHAINS.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  type="number"
                  className="flex-1 bg-transparent text-right text-2xl font-semibold tabular-nums outline-none"
                />
                <select
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="rounded-lg border border-border bg-surface-2/60 px-2 py-1 text-sm"
                >
                  <option value="USDC">USDC</option>
                  <option value="SOL">SOL</option>
                  <option value="ETH">ETH</option>
                  <option value="BNB">BNB</option>
                </select>
              </div>
            </div>

            {/* Direction */}
            <div className="flex justify-center">
              <button
                onClick={() => { const fc = fromChain; setFromChain(toChain); setToChain(fc); }}
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface-1 hover:chain-glow"
              >
                <ArrowRight className="h-4 w-4 rotate-90" />
              </button>
            </div>

            {/* To chain */}
            <div className="rounded-xl border border-border bg-surface-1/40 p-3">
              <div className="text-xs text-muted-foreground">To (estimated)</div>
              <div className="mt-2 flex items-center gap-2">
                <select
                  value={toChain}
                  onChange={(e) => setToChain(e.target.value)}
                  className="rounded-lg border border-border bg-surface-2/60 px-2 py-1 text-sm"
                >
                  {CHAINS.filter((c) => c.id !== fromChain).map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
                <div className="flex-1 text-right text-2xl font-semibold tabular-nums text-[color:var(--chain)]">
                  {bridgeQuote
                    ? (parseInt(bridgeQuote.toAmount) / 1e6).toFixed(4)
                    : bridging
                    ? "..."
                    : numAmt > 0
                    ? "—"
                    : "0.0"}
                </div>
                <span className="text-sm text-muted-foreground">{token}</span>
              </div>
            </div>

            {/* Bridge info */}
            {bridgeQuote && (
              <div className="rounded-lg bg-surface-1/40 p-3 text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Route</span>
                  <span className="text-foreground">
                    {bridgeQuote.steps?.map((s) => s.tool).filter(Boolean).join(" → ") || "Li.Fi"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Time</span>
                  <span className="text-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {bridgeQuote.estimatedTime ? `~${Math.round(bridgeQuote.estimatedTime / 60)} min` : "~2 min"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Gas Estimate</span>
                  <span className="text-foreground">
                    {bridgeQuote.estimatedGas ? `${(parseInt(bridgeQuote.estimatedGas) / 1e18).toFixed(6)} ETH` : "—"}
                  </span>
                </div>
              </div>
            )}

            {bridgeErr && (
              <div className="rounded-lg bg-red-500/10 p-2 text-[11px] text-red-400">
                Bridge quote unavailable. Try adjusting amount or chain pair.
              </div>
            )}

            <button
              onClick={handleBridge}
              disabled={!connected || bridging || !bridgeQuote || numAmt <= 0}
              className="h-11 w-full rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] font-semibold text-primary-foreground disabled:opacity-50"
            >
              {!connected ? "Connect Wallet" : bridging ? "Getting Quote..." : "Bridge via Li.Fi"}
            </button>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle
            title="Bridge Info"
            icon={<Zap className="h-4 w-4" />}
          />
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <div className="text-foreground font-medium mb-1">Supported Chains</div>
              <div className="flex flex-wrap gap-2">
                {["Solana", "Ethereum", "BNB Chain", "Base"].map((c) => (
                  <span key={c} className="rounded-full border border-border px-3 py-1 text-xs">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-foreground font-medium mb-1">Supported Tokens</div>
              <div className="flex flex-wrap gap-2">
                {["USDC", "SOL", "ETH", "BNB"].map((t) => (
                  <span key={t} className="rounded-full border border-[color:var(--chain)]/30 bg-[color:var(--chain)]/10 px-3 py-1 text-xs text-[color:var(--chain)]">{t}</span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border p-3 text-xs">
              <div className="flex items-center gap-2 text-foreground font-medium mb-2">
                <Zap className="h-3.5 w-3.5 text-[color:var(--chain)]" />
                Powered by Li.Fi
              </div>
              <p>
                Li.Fi aggregates DEXs, bridges, and cross-chain protocols to find the best route
                for your transfer. Quotes are real-time from on-chain liquidity.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
