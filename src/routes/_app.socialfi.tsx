import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { Users, Crown, Gift, Copy, Check, Star, TrendingUp, Award, Share2, ExternalLink } from "lucide-react";
import { useNativeWallet, shortAddr } from "@/lib/use-native-wallet";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app/socialfi")({
  head: () => ({ meta: [{ title: "SocialFi — Prophet" }] }),
  component: SocialFi,
});

// ─── Leaderboard Data (would be on-chain in production) ────────────
const LEADERBOARD = [
  { rank: 1, name: "CryptoOracle", address: "0x1a2b…3c4d", xp: 48200, badges: 12, winRate: 94, streak: 23, avatar: "🔮" },
  { rank: 2, name: "DeFiWhale", address: "0x5e6f…7g8h", xp: 42100, badges: 10, winRate: 91, streak: 18, avatar: "🐋" },
  { rank: 3, name: "AlphaSeeker", address: "0x9i0j…1k2l", xp: 38900, badges: 9, winRate: 88, streak: 15, avatar: "🎯" },
  { rank: 4, name: "GemHunter", address: "0x3m4n…5o6p", xp: 35400, badges: 8, winRate: 86, streak: 12, avatar: "💎" },
  { rank: 5, name: "SolMaxi", address: "0x7q8r…9s0t", xp: 32100, badges: 8, winRate: 84, streak: 10, avatar: "⚡" },
  { rank: 6, name: "NFTCollector", address: "0x1u2v…3w4x", xp: 28700, badges: 7, winRate: 82, streak: 8, avatar: "🖼️" },
  { rank: 7, name: "StakeKing", address: "0x5y6z…7a8b", xp: 25300, badges: 7, winRate: 79, streak: 7, avatar: "👑" },
  { rank: 8, name: "BridgeMaster", address: "0x9c0d…1e2f", xp: 22800, badges: 6, winRate: 77, streak: 6, avatar: "🌉" },
  { rank: 9, name: "DAO_Voter", address: "0x3g4h…5i6j", xp: 19400, badges: 6, winRate: 75, streak: 5, avatar: "🏛️" },
  { rank: 10, name: "RuneReader", address: "0x7k8l…9m0n", xp: 16200, badges: 5, winRate: 72, streak: 4, avatar: "📜" },
];

const BADGES = [
  { id: "alpha", name: "Alpha Prophet", icon: "🔮", desc: "First 100 users", rarity: "Legendary", color: "#FFD700" },
  { id: "diamond", name: "Diamond Hands", icon: "💎", desc: "Hold through 50% dip", rarity: "Epic", color: "#E040FB" },
  { id: "whale", name: "Whale Watcher", icon: "🐋", desc: "Track 10+ whale txs", rarity: "Rare", color: "#00BCD4" },
  { id: "gem", name: "Gem Finder", icon: "💠", desc: "Find 5 gems before $1M MC", rarity: "Epic", color: "#76FF03" },
  { id: "staker", name: "Stake Lord", icon: "👑", desc: "Stake 1000+ SOL", rarity: "Legendary", color: "#FFD700" },
  { id: "swap", name: "Degen Swap", icon: "🔄", desc: "50+ swaps", rarity: "Rare", color: "#FF6D00" },
  { id: "vote", name: "DAO Voice", icon: "🏛️", desc: "Vote on 10+ proposals", rarity: "Epic", color: "#2196F3" },
  { id: "bridge", name: "Bridge Master", icon: "🌉", desc: "Bridge 5+ chains", rarity: "Rare", color: "#00E676" },
  { id: "referral", name: "Evangelist", icon: "📢", desc: "Refer 10+ users", rarity: "Epic", color: "#E040FB" },
  { id: "win_streak", name: "Hot Streak", icon: "🔥", desc: "10+ prediction wins", rarity: "Rare", color: "#FF3D00" },
  { id: "nft", name: "NFT Collector", icon: "🖼️", desc: "Hold 10+ NFTs", rarity: "Rare", color: "#7C4DFF" },
  { id: "early", name: "Early Bird", icon: "🐦", desc: "Joined in first week", rarity: "Legendary", color: "#FFD700" },
];

function SocialFi() {
  const { connected, publicKey } = useNativeWallet();
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"leaderboard" | "badges" | "referral">("leaderboard");

  const referralCode = useMemo(() => {
    if (!publicKey) return "";
    return publicKey.slice(0, 8).toUpperCase();
  }, [publicKey]);

  const referralLink = useMemo(() => {
    if (!referralCode) return "";
    return `https://prophet1.vercel.app/?ref=${referralCode}`;
  }, [referralCode]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="SocialFi"
        description="Compete on leaderboards, earn badges, refer friends, and build your on-chain reputation."
      />

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {[
          { id: "leaderboard" as const, label: "Leaderboard", icon: Crown },
          { id: "badges" as const, label: "Badges", icon: Award },
          { id: "referral" as const, label: "Referral", icon: Gift },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                tab === t.id
                  ? "border-[color:var(--chain)] bg-[color:var(--chain)]/15 text-[color:var(--chain)]"
                  : "border-border bg-surface-1/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Leaderboard */}
      {tab === "leaderboard" && (
        <div className="space-y-4">
          {/* Top 3 podium */}
          <div className="grid grid-cols-3 gap-3">
            {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((user, i) => {
              const positions = [2, 1, 3];
              const pos = positions[i];
              const heights = ["h-24", "h-32", "h-20"];
              const colors = ["#C0C0C0", "#FFD700", "#CD7F32"];

              return (
                <GlassCard key={user.rank} className="text-center pt-4">
                  <div className="text-3xl mb-1">{user.avatar}</div>
                  <div className="text-sm font-bold">{user.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{user.address}</div>
                  <div className="mt-2 text-lg font-bold text-[color:var(--chain)]">{user.xp.toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground">XP</div>
                  <div className={`mt-2 mx-auto w-full ${heights[i]} rounded-t-lg flex items-end justify-center pb-2`} style={{ background: `${colors[i]}20` }}>
                    <span className="text-2xl font-bold" style={{ color: colors[i] }}>#{pos}</span>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Full leaderboard */}
          <GlassCard className="p-0">
            <div className="divide-y divide-border">
              {LEADERBOARD.map((user) => (
                <div key={user.rank} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                  <div className={`w-8 text-center text-sm font-bold ${
                    user.rank <= 3 ? "text-yellow-400" : "text-muted-foreground"
                  }`}>
                    {user.rank <= 3 ? ["🥇", "🥈", "🥉"][user.rank - 1] : `#${user.rank}`}
                  </div>
                  <span className="text-xl">{user.avatar}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{user.address}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[color:var(--chain)]">{user.xp.toLocaleString()}</div>
                    <div className="text-[10px] text-muted-foreground">{user.winRate}% win · {user.streak} streak</div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: Math.min(user.badges, 5) }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Your position */}
          {connected && (
            <GlassCard glow>
              <div className="flex items-center gap-3">
                <div className="w-8 text-center text-sm font-bold text-muted-foreground">--</div>
                <span className="text-xl">👤</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">You ({shortAddr(publicKey)})</div>
                  <div className="text-[10px] text-muted-foreground">Connect wallet to track your rank</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-muted-foreground">--</div>
                  <div className="text-[10px] text-muted-foreground">Start playing to rank up</div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {/* Badges */}
      {tab === "badges" && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {BADGES.map((badge) => (
            <GlassCard key={badge.id} hover>
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl text-2xl" style={{ background: `${badge.color}15` }}>
                  {badge.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{badge.name}</div>
                  <div className="text-[10px] text-muted-foreground">{badge.desc}</div>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                  style={{ background: `${badge.color}20`, color: badge.color }}
                >
                  {badge.rarity}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Referral */}
      {tab === "referral" && (
        <div className="space-y-4">
          {connected ? (
            <>
              <GlassCard glow>
                <div className="text-center py-4">
                  <Gift className="mx-auto mb-3 h-10 w-10 text-[color:var(--chain)]" />
                  <div className="text-lg font-bold">Invite Friends, Earn Together</div>
                  <div className="text-xs text-muted-foreground mt-1">Get 10% of your friends' XP as bonus rewards</div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Your Referral Code</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg border border-border bg-surface-1/60 px-4 py-3 font-mono text-lg font-bold text-[color:var(--chain)]">
                    {referralCode}
                  </div>
                  <button
                    onClick={() => handleCopy(referralCode)}
                    className="h-12 w-12 rounded-lg border border-border flex items-center justify-center hover:bg-white/5"
                  >
                    {copied ? <Check className="h-5 w-5 text-[color:var(--success)]" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Referral Link</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg border border-border bg-surface-1/60 px-4 py-3 text-xs text-muted-foreground truncate">
                    {referralLink}
                  </div>
                  <button
                    onClick={() => handleCopy(referralLink)}
                    className="h-12 w-12 rounded-lg border border-border flex items-center justify-center hover:bg-white/5"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </GlassCard>

              {/* Share buttons */}
              <GlassCard>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Share</div>
                <div className="flex gap-2">
                  {[
                    { name: "Twitter", icon: "𝕏", url: `https://twitter.com/intent/tweet?text=Join%20me%20on%20Prophet!%20Use%20my%20code%3A%20${referralCode}%20https://prophet1.vercel.app` },
                    { name: "Telegram", icon: "✈️", url: `https://t.me/share/url?url=https://prophet1.vercel.app?ref=${referralCode}&text=Join%20Prophet%20DeFi` },
                    { name: "Warpcast", icon: "🪄", url: `https://warpcast.com/~/compose?text=Join%20Prophet%20DeFi!%20Ref:%20${referralCode}` },
                  ].map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm hover:bg-white/5"
                    >
                      <span>{s.icon}</span> {s.name}
                    </a>
                  ))}
                </div>
              </GlassCard>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <GlassCard className="text-center py-4">
                  <div className="text-2xl font-bold text-[color:var(--chain)]">0</div>
                  <div className="text-[10px] text-muted-foreground">Referrals</div>
                </GlassCard>
                <GlassCard className="text-center py-4">
                  <div className="text-2xl font-bold text-[color:var(--chain)]">0</div>
                  <div className="text-[10px] text-muted-foreground">Bonus XP</div>
                </GlassCard>
                <GlassCard className="text-center py-4">
                  <div className="text-2xl font-bold text-[color:var(--chain)]">0</div>
                  <div className="text-[10px] text-muted-foreground">Friends Active</div>
                </GlassCard>
              </div>
            </>
          ) : (
            <GlassCard className="py-12 text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground opacity-50" />
              <div className="text-sm text-muted-foreground">Connect wallet to get your referral code</div>
            </GlassCard>
          )}
        </div>
      )}
    </>
  );
}
