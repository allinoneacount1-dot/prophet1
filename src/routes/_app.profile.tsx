import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { StatCard } from "@/components/app/StatCard";
import { Award, Crown, Sparkles, Copy, Check, ExternalLink, Wallet } from "lucide-react";
import { useChain, shortAddr } from "@/lib/chain";
import { useNativeWallet } from "@/lib/use-native-wallet";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPortfolio } from "@/lib/onchain";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — Prophet" }] }),
  component: Profile,
});

const RANKS = ["Explorer", "Seeker", "Analyst", "Oracle", "Prophet", "ArchProphet"];

const BADGES = [
  { id: "early", name: "Early Prophet", icon: "🔮", desc: "Joined during beta" },
  { id: "staker", name: "Staker", icon: "💪", desc: "Staked 100+ SOL" },
  { id: "swapper", name: "Degen Swap", icon: "🔄", desc: "10+ swaps" },
  { id: "gem", name: "Gem Finder", icon: "💎", desc: "Tracked 5+ gems" },
  { id: "whale", name: "Whale Watch", icon: "🐋", desc: "Whale alert triggered" },
  { id: "dao", name: "DAO Voter", icon: "🏛️", desc: "Voted on 3+ proposals" },
  { id: "nft", name: "NFT Collector", icon: "🖼️", desc: "5+ NFTs held" },
  { id: "bridge", name: "Bridge Master", icon: "🌉", desc: "Cross-chain bridge" },
];

function Profile() {
  const { address } = useChain();
  const { connected, publicKey } = useNativeWallet();
  const [copied, setCopied] = useState(false);

  // Fetch real portfolio data
  const { data: portfolio } = useQuery({
    queryKey: ["profilePortfolio", publicKey],
    queryFn: () => fetchPortfolio(publicKey!),
    enabled: !!publicKey,
    staleTime: 30_000,
  });

  // Level calculation based on activity
  const level = useMemo(() => {
    if (!portfolio) return 1;
    let lvl = 1;
    if (portfolio.solBalance > 0) lvl += 5;
    if (portfolio.solBalance > 1) lvl += 10;
    if (portfolio.tokenBalances.length > 0) lvl += 5;
    if (portfolio.tokenBalances.length > 3) lvl += 10;
    if (portfolio.totalValue > 1000) lvl += 10;
    if (portfolio.totalValue > 10000) lvl += 15;
    return Math.min(lvl, 100);
  }, [portfolio]);

  const xp = level * 420;
  const nextLevelXP = (level + 1) * 420;
  const progress = ((xp % 420) / 420) * 100;
  const rank = RANKS[Math.min(RANKS.length - 1, Math.floor(level / 20))];

  const activeBadges = BADGES.slice(0, Math.max(1, Math.floor(level / 10)));

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!connected) {
    return (
      <>
        <PageHeader
          eyebrow="Identity"
          title="Your Profile"
          description="On-chain reputation, XP, badges, and NFT collection"
        />
        <GlassCard className="py-12 text-center">
          <Wallet className="mx-auto mb-3 h-10 w-10 text-muted-foreground opacity-50" />
          <div className="text-sm text-muted-foreground">Connect wallet to view your on-chain profile</div>
        </GlassCard>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="On-Chain Identity"
        title="Profile"
        description={`Wallet: ${shortAddr(publicKey)} · Rank: ${rank} · Level ${level}`}
      />

      {/* Main Profile Card */}
      <GlassCard glow className="mb-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] text-2xl font-bold text-primary-foreground">
            {rank[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="text-lg font-bold">{rank}</div>
              <span className="rounded-full bg-[color:var(--chain)]/15 px-2 py-0.5 text-[10px] font-bold text-[color:var(--chain)]">
                LVL {level}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <code className="text-xs text-muted-foreground font-mono">{shortAddr(publicKey)}</code>
              <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground">
                {copied ? <Check className="h-3.5 w-3.5 text-[color:var(--success)]" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            {/* XP Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{xp.toLocaleString()} XP</span>
                <span>Next: {nextLevelXP.toLocaleString()} XP</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--prophet),var(--chain))] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Portfolio Value"
          value={portfolio ? `$${portfolio.totalValue.toFixed(2)}` : "—"}
          icon={<Sparkles className="h-4 w-4" />}
        />
        <StatCard
          label="SOL Balance"
          value={portfolio ? `${portfolio.solBalance.toFixed(4)} SOL` : "—"}
          icon={<Crown className="h-4 w-4" />}
        />
        <StatCard
          label="Tokens"
          value={`${portfolio?.tokenBalances.length || 0} assets`}
          icon={<Award className="h-4 w-4" />}
        />
        <StatCard
          label="Badges"
          value={`${activeBadges.length} earned`}
          icon={<Award className="h-4 w-4" />}
        />
      </div>

      {/* Badges */}
      <div className="mt-8">
        <div className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Award className="h-4 w-4 text-[color:var(--chain)]" /> Badges
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {BADGES.map((b) => {
            const earned = activeBadges.some((ab) => ab.id === b.id);
            return (
              <GlassCard key={b.id} className={earned ? "border-[color:var(--chain)]/30" : "opacity-40"}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <div className="text-sm font-semibold">{b.name}</div>
                    <div className="text-[10px] text-muted-foreground">{b.desc}</div>
                    {earned && (
                      <div className="text-[10px] text-[color:var(--chain)] font-medium mt-0.5">✓ Earned</div>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* On-Chain XP Breakdown */}
      <div className="mt-8">
        <div className="text-sm font-semibold mb-4">XP Breakdown</div>
        <GlassCard>
          <div className="space-y-3">
            {[
              { label: "Wallet connected", xp: 50, done: true },
              { label: "Hold SOL", xp: 50, done: (portfolio?.solBalance || 0) > 0 },
              { label: "Hold 1+ SOL", xp: 100, done: (portfolio?.solBalance || 0) > 1 },
              { label: "Own SPL tokens", xp: 50, done: (portfolio?.tokenBalances.length || 0) > 0 },
              { label: "Own 3+ tokens", xp: 100, done: (portfolio?.tokenBalances.length || 0) > 3 },
              { label: "Portfolio > $1K", xp: 100, done: (portfolio?.totalValue || 0) > 1000 },
              { label: "Portfolio > $10K", xp: 150, done: (portfolio?.totalValue || 0) > 10000 },
              { label: "Stake SOL", xp: 200, done: false },
              { label: "Execute a swap", xp: 150, done: false },
              { label: "Vote on proposal", xp: 200, done: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={item.done ? "text-[color:var(--success)]" : "text-muted-foreground"}>
                    {item.done ? "✓" : "○"}
                  </span>
                  <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                </div>
                <span className={item.done ? "text-[color:var(--chain)]" : "text-muted-foreground"}>+{item.xp} XP</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Solana Domain */}
      <div className="mt-8">
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Solana Domain</div>
              <div className="text-xs text-muted-foreground">Connect your .sol domain for a human-readable identity</div>
            </div>
            <a
              href="https://naming.bonfida.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg border border-[color:var(--chain)]/30 bg-[color:var(--chain)]/10 px-3 py-1.5 text-xs text-[color:var(--chain)] hover:chain-glow"
            >
              Get .sol <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
