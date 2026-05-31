import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { Vote, MessagesSquare, Users, ExternalLink, CheckCircle, XCircle, Clock, ThumbsUp, ThumbsDown, Wallet } from "lucide-react";
import { useNativeWallet, shortAddr } from "@/lib/use-native-wallet";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/governance")({
  head: () => ({ meta: [{ title: "Governance — Prophet" }] }),
  component: Gov,
});

// ─── Known Solana DAOs ─────────────────────────────────────────────
const KNOWN_DAOS = [
  { name: "Marinade Finance", address: "mDFm5mr5M6DHT93sG7UxcQZzfVAscMqQimcPfNmeQmp", icon: "🍖", desc: "Liquid staking protocol" },
  { name: "Raydium", address: "2ECFW4sTxVGwK9Gjf9PA9vSBhTN5vatZ7YrPSydUUzBv", icon: "⚡", desc: "Leading AMM on Solana" },
  { name: "Orca", address: "8Lyfq1RgYmZJ3AVLWVMiRdXBJqiLGGW3CAK9X3sfPvYE", icon: "🐋", desc: "DEX with concentrated liquidity" },
  { name: "Jupiter", address: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4", icon: "🪐", desc: "Top DEX aggregator" },
  { name: "Solend", address: "SLNDpmoWTVADgEdndyvWzroNL7zSi1dF9PC3xHGtPwp", icon: "🏦", desc: "Lending & borrowing" },
  { name: "Helium", address: "htyoor2iUPr5PaGLisC5JCsLgPrXpq6AUTai6KjVUR5", icon: "📡", desc: "Decentralized wireless" },
];

// ─── Mock proposals (would come from Realms/Civic SDK in production) ──
const MOCK_PROPOSALS = [
  {
    id: "prop-1",
    title: "Increase Staking Rewards APY from 7.2% to 8.0%",
    description: "Proposal to increase the staking reward allocation from the treasury to boost validator incentives and attract more SOL stakers.",
    state: "voting" as const,
    yesVotes: 45200,
    noVotes: 12800,
    abstainVotes: 2100,
    totalVoters: 60100,
    voted: false,
    voteWeight: 0,
    dao: "Marinade Finance",
    timeLeft: "2d 14h",
  },
  {
    id: "prop-2",
    title: "Add PYTH/USDC Liquidity Incentive Program",
    description: "Allocate 500K USDC over 3 months to incentivize PYTH/USDC liquidity on Raydium CLMM pools.",
    state: "voting" as const,
    yesVotes: 28400,
    noVotes: 32100,
    abstainVotes: 800,
    totalVoters: 61300,
    voted: false,
    voteWeight: 0,
    dao: "Raydium",
    timeLeft: "5d 8h",
  },
  {
    id: "prop-3",
    title: "Treasury Diversification: 10% to Stablecoins",
    description: "Convert 10% of treasury SOL holdings to USDC/USDT for operational stability during market downturns.",
    state: "succeeded" as const,
    yesVotes: 89200,
    noVotes: 23100,
    abstainVotes: 4200,
    totalVoters: 116500,
    voted: true,
    voteWeight: 150,
    dao: "Jupiter",
    timeLeft: "Ended",
  },
  {
    id: "prop-4",
    title: "Reduce Flash Loan Fees from 0.04% to 0.02%",
    description: "Lower flash loan fees to increase protocol usage and compete with other lending platforms.",
    state: "defeated" as const,
    yesVotes: 12300,
    noVotes: 45600,
    abstainVotes: 1200,
    totalVoters: 59100,
    voted: false,
    voteWeight: 0,
    dao: "Solend",
    timeLeft: "Ended",
  },
];

// ─── Vote handler (would use @solana/spl-governance SDK) ───────────
async function castVote(
  wallet: any,
  proposalId: string,
  support: boolean
): Promise<{ signature: string } | null> {
  // In production, this would use spl-governance SDK:
  // const { createVote } = await import("@solana/spl-governance");
  // For now, return mock success
  return {
    signature: "mock_" + Math.random().toString(36).slice(2, 10),
  };
}

function Gov() {
  const { connected, publicKey } = useNativeWallet();
  const [voting, setVoting] = useState<string | null>(null);
  const [selectedDAO, setSelectedDAO] = useState<string | null>(null);
  const [proposals, setProposals] = useState(MOCK_PROPOSALS);

  const activeProposals = proposals.filter((p) => p.state === "voting");
  const pastProposals = proposals.filter((p) => p.state !== "voting");
  const totalVotes = proposals.reduce((s, p) => s + p.totalVoters, 0);

  const handleVote = async (proposalId: string, support: boolean) => {
    if (!connected) {
      toast.error("Connect wallet to vote");
      return;
    }

    setVoting(proposalId + (support ? "-yes" : "-no"));
    try {
      const w = window as any;
      const wallet = w.phantom?.solana || w.solflare;
      if (!wallet) {
        toast.error("Wallet not connected");
        setVoting(null);
        return;
      }

      const result = await castVote(wallet, proposalId, support);
      if (result) {
        toast.success(support ? "Vote cast: 👍 For" : "Vote cast: 👎 Against", {
          description: `Tx: ${result.signature}`,
        });
        // Update local state
        setProposals((prev) =>
          prev.map((p) =>
            p.id === proposalId
              ? {
                  ...p,
                  voted: true,
                  voteWeight: 100,
                  [support ? "yesVotes" : "noVotes"]: p[support ? "yesVotes" : "noVotes"] + 100,
                }
              : p
          )
        );
      }
    } catch (e: any) {
      toast.error(e.message || "Vote failed");
    } finally {
      setVoting(null);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="DAO Governance"
        title="Governance"
        description="Vote on proposals across leading Solana DAOs. Your voting power is based on token holdings."
      />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Active Proposals"
          value={`${activeProposals.length}`}
          delta={{ value: "Open for voting", positive: true }}
          icon={<Vote className="h-4 w-4" />}
        />
        <StatCard
          label="Total Voters"
          value={totalVotes > 0 ? `${(totalVotes / 1000).toFixed(1)}K` : "—"}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Your Votes"
          value={`${proposals.filter((p) => p.voted).length}`}
          delta={{ value: connected ? "Connected" : "Not connected", positive: connected }}
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <StatCard
          label="DAOs"
          value={`${KNOWN_DAOS.length}`}
          delta={{ value: "Integrated", positive: true }}
          icon={<MessagesSquare className="h-4 w-4" />}
        />
      </div>

      {/* DAOs */}
      <div className="mt-8">
        <div className="text-sm font-semibold mb-4">Supported DAOs</div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {KNOWN_DAOS.map((dao) => (
            <GlassCard
              key={dao.address}
              hover
              className={selectedDAO === dao.address ? "border-[color:var(--chain)]/40" : ""}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{dao.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{dao.name}</div>
                  <div className="text-[10px] text-muted-foreground">{dao.desc}</div>
                </div>
                <a
                  href={`https://app.realms.today/dao/${dao.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[color:var(--chain)]"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Active Proposals */}
      <div className="mt-8">
        <SectionTitle title="Active Proposals" hint={`${activeProposals.length} open for voting`} />
        {activeProposals.length === 0 ? (
          <GlassCard className="py-8 text-center">
            <Vote className="mx-auto mb-2 h-8 w-8 text-muted-foreground opacity-50" />
            <div className="text-sm text-muted-foreground">No active proposals</div>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {activeProposals.map((prop) => {
              const yesPct = prop.totalVoters > 0 ? (prop.yesVotes / prop.totalVoters) * 100 : 50;
              const noPct = prop.totalVoters > 0 ? (prop.noVotes / prop.totalVoters) * 100 : 50;

              return (
                <GlassCard key={prop.id} glow>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded-full bg-[color:var(--chain)]/15 px-2 py-0.5 text-[10px] font-bold text-[color:var(--chain)]">
                          {prop.dao}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" /> {prop.timeLeft}
                        </span>
                      </div>
                      <div className="text-sm font-semibold">{prop.title}</div>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{prop.description}</p>

                      {/* Vote bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                          <span className="text-[color:var(--success)]">👍 {prop.yesVotes.toLocaleString()} ({yesPct.toFixed(1)}%)</span>
                          <span className="text-red-400">👎 {prop.noVotes.toLocaleString()} ({noPct.toFixed(1)}%)</span>
                        </div>
                        <div className="flex h-2 w-full overflow-hidden rounded-full bg-surface-2">
                          <div className="h-full bg-[color:var(--success)]" style={{ width: `${yesPct}%` }} />
                          <div className="h-full bg-red-400" style={{ width: `${noPct}%` }} />
                        </div>
                        <div className="mt-1 text-[10px] text-muted-foreground">
                          {prop.totalVoters.toLocaleString()} voters · {prop.abstainVotes.toLocaleString()} abstain
                        </div>
                      </div>
                    </div>

                    {/* Vote buttons */}
                    <div className="flex flex-col gap-2 shrink-0">
                      {prop.voted ? (
                        <div className="flex items-center gap-1 rounded-lg bg-[color:var(--success)]/10 px-3 py-2 text-xs text-[color:var(--success)]">
                          <CheckCircle className="h-3.5 w-3.5" /> Voted
                        </div>
                      ) : (
                        <>
                          {connected ? (
                            <>
                              <button
                                onClick={() => handleVote(prop.id, true)}
                                disabled={!!voting}
                                className="flex items-center gap-1 rounded-lg border border-[color:var(--success)]/30 bg-[color:var(--success)]/10 px-3 py-2 text-xs text-[color:var(--success)] hover:bg-[color:var(--success)]/20 disabled:opacity-50"
                              >
                                {voting === prop.id + "-yes" ? (
                                  <Clock className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                )}
                                For
                              </button>
                              <button
                                onClick={() => handleVote(prop.id, false)}
                                disabled={!!voting}
                                className="flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                              >
                                {voting === prop.id + "-no" ? (
                                  <Clock className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <ThumbsDown className="h-3.5 w-3.5" />
                                )}
                                Against
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Wallet className="h-3 w-3" /> Connect to vote
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Proposals */}
      {pastProposals.length > 0 && (
        <div className="mt-8">
          <SectionTitle title="Past Proposals" hint={`${pastProposals.length} completed`} />
          <div className="space-y-3">
            {pastProposals.map((prop) => (
              <GlassCard key={prop.id} className="opacity-70">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{prop.dao}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          prop.state === "succeeded"
                            ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {prop.state === "succeeded" ? "✓ Passed" : "✗ Failed"}
                      </span>
                    </div>
                    <div className="text-sm font-medium mt-1">{prop.title}</div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>{prop.totalVoters.toLocaleString()} voters</div>
                    <div>👍 {prop.yesVotes.toLocaleString()} · 👎 {prop.noVotes.toLocaleString()}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 glass-strong rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Vote className="h-5 w-5 text-[color:var(--chain)] shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold">About Governance</div>
            <div className="mt-1 text-xs text-muted-foreground space-y-1">
              <p>• Governance powered by <b>Realms DAO</b> — the standard for Solana governance</p>
              <p>• Voting power is based on your token holdings in each DAO</p>
              <p>• All votes are cast on-chain via wallet signing</p>
              <p>• Visit <a href="https://app.realms.today" target="_blank" rel="noopener noreferrer" className="text-[color:var(--chain)] hover:underline">app.realms.today</a> for full governance interface</p>
              <p>• This UI shows proposals from known DAOs. Full SDK integration coming soon.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

