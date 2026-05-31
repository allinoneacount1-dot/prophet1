import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { StatCard } from "@/components/app/StatCard";
import { Coins, Crown, Sparkles, ArrowDownCircle, ArrowUpCircle, Loader2, AlertTriangle, Wallet } from "lucide-react";
import { fmtUsd, useTokenPrice } from "@/lib/mock";
import { useNativeWallet, shortAddr } from "@/lib/use-native-wallet";
import { useQuery } from "@tanstack/react-query";
import {
  RECOMMENDED_VALIDATORS,
  fetchStakeAccounts,
  fetchEpochInfo,
  delegateStake,
  deactivateStake,
  withdrawStake,
  type StakeAccount,
} from "@/lib/sol-staking";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/staking")({
  head: () => ({ meta: [{ title: "Staking & Yield — Prophet" }] }),
  component: Staking,
});

// ─── Stake Action Modal ────────────────────────────────────────────
function StakeModal({
  open,
  onClose,
  validator,
  walletBalance,
}: {
  open: boolean;
  onClose: () => void;
  validator: (typeof RECOMMENDED_VALIDATORS)[0] | null;
  walletBalance: number;
}) {
  const { publicKey } = useNativeWallet();
  const [amount, setAmount] = useState("");
  const [staking, setStaking] = useState(false);

  const numAmt = parseFloat(amount) || 0;
  const maxStake = Math.max(walletBalance - 0.01, 0); // keep 0.01 SOL for fees

  const handleStake = async () => {
    if (!publicKey || !validator || numAmt <= 0) return;
    if (numAmt > maxStake) {
      toast.error("Insufficient balance (keep ~0.01 SOL for fees)");
      return;
    }

    setStaking(true);
    try {
      // We need the actual wallet provider from the window
      const { getProvider } = await import("@/lib/use-native-wallet");
      // We can't use getProvider directly — need to access window.phantom.solana etc
      // For now, use the native wallet hook's connect method which sets up the provider
      // The user should already be connected; we'll access the wallet via the window
      const w = window as any;
      const wallet = w.phantom?.solana || w.solflare;
      if (!wallet) {
        toast.error("Wallet not connected. Please connect first.");
        setStaking(false);
        return;
      }

      const { signature, stakeAccount } = await delegateStake(
        wallet,
        validator.voteAccount,
        numAmt
      );

      toast.success("Stake delegated!", {
        description: `${numAmt} SOL → ${validator.name}. Tx: ${signature.slice(0, 16)}...`,
      });
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Staking failed. Please try again.");
    } finally {
      setStaking(false);
    }
  };

  if (!open || !validator) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-surface-1 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Stake SOL</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:text-foreground">✕</button>
        </div>

        {/* Validator info */}
        <div className="mb-4 rounded-xl border border-border bg-surface-1/60 p-3">
          <div className="text-sm font-semibold">{validator.name}</div>
          <div className="text-xs text-muted-foreground">{validator.description}</div>
          <div className="mt-1 text-xs text-[color:var(--chain)]">APY: ~{validator.apy}%</div>
        </div>

        {/* Amount input */}
        <label className="text-xs text-muted-foreground">Amount (SOL)</label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="h-11 flex-1 rounded-lg border border-border bg-surface-1/60 px-3 text-lg font-semibold tabular-nums outline-none focus:border-[color:var(--chain)]"
          />
          <button
            onClick={() => setAmount(maxStake.toFixed(4))}
            className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-white/5"
          >
            MAX
          </button>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Balance: {walletBalance.toFixed(4)} SOL · Fee reserve: 0.01 SOL
        </div>

        {/* Duration info */}
        <div className="mt-4 rounded-lg border border-border bg-surface-1/40 p-3 text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Lock-up</span>
            <span className="text-foreground">None (deactivate anytime)</span>
          </div>
          <div className="flex justify-between">
            <span>Unstake period</span>
            <span className="text-foreground">~2-3 epochs (~2-3 days)</span>
          </div>
          <div className="flex justify-between">
            <span>Rewards</span>
            <span className="text-foreground">Auto-compounded</span>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-yellow-500/10 p-2 text-[11px] text-yellow-400">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>Staking requires wallet signing. A new stake account will be created. Rent (~0.02 SOL) will be reclaimed when you withdraw.</span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={onClose}
            className="h-11 flex-1 rounded-xl border border-border text-sm text-muted-foreground hover:bg-white/5"
            disabled={staking}
          >
            Cancel
          </button>
          <button
            onClick={handleStake}
            disabled={staking || numAmt <= 0}
            className="h-11 flex-1 rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] font-semibold text-primary-foreground disabled:opacity-50"
          >
            {staking ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Staking...
              </span>
            ) : (
              `Stake ${numAmt > 0 ? numAmt + " SOL" : "SOL"}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Staking() {
  const { connected, publicKey } = useNativeWallet();
  const { data: solPrice } = useTokenPrice("SOL");
  const [selectedValidator, setSelectedValidator] = useState<(typeof RECOMMENDED_VALIDATORS)[0] | null>(null);
  const [stakeModalOpen, setStakeModalOpen] = useState(false);

  // Fetch stake accounts
  const {
    data: stakeAccounts = [],
    isLoading: loadingStakes,
    refetch: refetchStakes,
  } = useQuery({
    queryKey: ["stakeAccounts", publicKey],
    queryFn: () => fetchStakeAccounts(publicKey!),
    enabled: !!publicKey,
    refetchInterval: 30_000,
  });

  // Calculate totals
  const totalStaked = useMemo(() => {
    return stakeAccounts.reduce((sum, s) => sum + s.SOL, 0);
  }, [stakeAccounts]);

  const totalStakedUSD = totalStaked * (solPrice || 0);
  const estimatedAPY = 7.2; // Average across recommended
  const estimatedDailyReward = (totalStaked * (estimatedAPY / 100)) / 365;
  const estimatedMonthlyReward = (totalStaked * (estimatedAPY / 100)) / 12;

  const handleDeactivate = async (stakeAccount: StakeAccount) => {
    if (!connected) return;
    try {
      const w = window as any;
      const wallet = w.phantom?.solana || w.solflare;
      if (!wallet) { toast.error("Wallet not connected"); return; }

      const { signature } = await deactivateStake(wallet, stakeAccount.pubkey);
      toast.success("Deactivation initiated", {
        description: `~2-3 days to unstake. Tx: ${signature.slice(0, 16)}...`,
      });
      refetchStakes();
    } catch (e: any) {
      toast.error(e.message || "Deactivation failed");
    }
  };

  const handleWithdraw = async (stakeAccount: StakeAccount) => {
    if (!connected) return;
    try {
      const w = window as any;
      const wallet = w.phantom?.solana || w.solflare;
      if (!wallet) { toast.error("Wallet not connected"); return; }

      const { signature } = await withdrawStake(wallet, stakeAccount.pubkey);
      toast.success("SOL withdrawn!", {
        description: `Tx: ${signature.slice(0, 16)}...`,
      });
      refetchStakes();
    } catch (e: any) {
      toast.error(e.message || "Withdraw failed");
    }
  };

  const openStakeModal = (validator: (typeof RECOMMENDED_VALIDATORS)[0]) => {
    setSelectedValidator(validator);
    setStakeModalOpen(true);
  };

  if (!connected) {
    return (
      <>
        <PageHeader
          eyebrow="DeFi Portal"
          title="Native SOL Staking"
          description="Stake SOL directly to validators. No smart contract — pure on-chain delegation."
        />
        <GlassCard className="py-12 text-center">
          <Wallet className="mx-auto mb-3 h-10 w-10 text-muted-foreground opacity-50" />
          <div className="text-sm text-muted-foreground">Connect your wallet to stake SOL natively</div>
        </GlassCard>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Native SOL Staking"
        title="Stake SOL · On-Chain"
        description="Pure Solana staking — delegate to validators directly. No intermediary contracts."
      />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Total Staked"
          value={`${totalStaked.toFixed(4)} SOL`}
          delta={totalStakedUSD > 0 ? { value: fmtUsd(totalStakedUSD), positive: true } : undefined}
          icon={<Coins className="h-4 w-4" />}
        />
        <StatCard
          label="Est. Daily Rewards"
          value={`+${estimatedDailyReward.toFixed(4)} SOL`}
          delta={{ value: `~${estimatedAPY}% APY`, positive: true }}
          icon={<Sparkles className="h-4 w-4" />}
        />
        <StatCard
          label="Stake Accounts"
          value={`${stakeAccounts.length}`}
          delta={{ value: loadingStakes ? "Loading..." : "Live", positive: !loadingStakes }}
          icon={<Crown className="h-4 w-4" />}
        />
        <StatCard
          label="Est. Monthly"
          value={`+${estimatedMonthlyReward.toFixed(4)} SOL`}
          icon={<Coins className="h-4 w-4" />}
        />
      </div>

      {/* Active Stake Accounts */}
      <div className="mt-8">
        <SectionTitle title="Your Stake Accounts" hint={loadingStakes ? "Loading..." : `${stakeAccounts.length} accounts`} />
        {loadingStakes ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <GlassCard key={i}>
                <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-4 w-24 animate-pulse rounded bg-white/5" />
              </GlassCard>
            ))}
          </div>
        ) : stakeAccounts.length === 0 ? (
          <GlassCard className="py-8 text-center">
            <div className="text-sm text-muted-foreground">No active stake accounts found</div>
            <div className="mt-1 text-xs text-muted-foreground">Stake SOL below to get started</div>
          </GlassCard>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {stakeAccounts.map((sa) => (
              <GlassCard key={sa.pubkey} glow={sa.state === "active"}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold">{sa.SOL.toFixed(4)} SOL</div>
                    <div className="mt-1 text-xs text-muted-foreground font-mono">
                      {sa.pubkey.slice(0, 8)}…{sa.pubkey.slice(-8)}
                    </div>
                    {sa.validator && (
                      <div className="mt-1 text-[10px] text-muted-foreground">
                        Validator: {sa.validator.slice(0, 8)}…{sa.validator.slice(-8)}
                      </div>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      sa.state === "active"
                        ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                        : sa.state === "activating"
                        ? "bg-yellow-500/15 text-yellow-400"
                        : sa.state === "deactivating"
                        ? "bg-orange-500/15 text-orange-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {sa.state}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  {(sa.state === "active" || sa.state === "activating") && (
                    <button
                      onClick={() => handleDeactivate(sa)}
                      className="flex items-center gap-1 rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs text-orange-400 hover:bg-orange-500/20"
                    >
                      <ArrowDownCircle className="h-3 w-3" /> Deactivate
                    </button>
                  )}
                  {sa.state === "inactive" && sa.SOL > 0.02 && (
                    <button
                      onClick={() => handleWithdraw(sa)}
                      className="flex items-center gap-1 rounded-lg border border-[color:var(--chain)]/30 bg-[color:var(--chain)]/10 px-3 py-1.5 text-xs text-[color:var(--chain)] hover:chain-glow"
                    >
                      <ArrowUpCircle className="h-3 w-3" /> Withdraw
                    </button>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Validator Selection */}
      <div className="mt-8">
        <SectionTitle title="Stake to Validator" hint="Choose a validator to delegate your SOL" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {RECOMMENDED_VALIDATORS.map((v) => (
            <GlassCard key={v.voteAccount} hover>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold">{v.name}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">{v.description}</div>
                </div>
                <span className="rounded-full bg-[color:var(--chain)]/15 px-2 py-0.5 text-[10px] font-bold text-[color:var(--chain)]">
                  ~{v.apy}%
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <div className="text-xl font-semibold tabular-nums text-[color:var(--chain)]">
                  ~{v.apy}%
                </div>
                <div className="text-xs text-muted-foreground">est. APY</div>
              </div>
              <button
                onClick={() => openStakeModal(v)}
                className="mt-3 h-9 w-full rounded-lg bg-[linear-gradient(135deg,var(--prophet),var(--chain))] text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                Stake SOL
              </button>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 glass-strong rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold">Native SOL Staking Info</div>
            <div className="mt-1 text-xs text-muted-foreground space-y-1">
              <p>• Staking requires wallet signing. You'll create a new stake account per delegation.</p>
              <p>• Each stake account has a rent deposit (~0.02 SOL) that's reclaimed on withdrawal.</p>
              <p>• Unstaking takes ~2-3 epochs (2-3 days) — this is a Solana network rule.</p>
              <p>• Rewards are auto-compounded into your staked balance each epoch.</p>
              <p>• Minimum stake: 0.01 SOL (plus rent). No lock-up period enforced by Prophet.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stake Modal */}
      <StakeModal
        open={stakeModalOpen}
        onClose={() => setStakeModalOpen(false)}
        validator={selectedValidator}
        walletBalance={0} // Will be fetched from wallet
      />
    </>
  );
}


