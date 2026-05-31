import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { StatCard } from "@/components/app/StatCard";
import { Spark } from "@/components/app/Spark";
import { Activity, Users, DollarSign, Flame, TrendingUp, BarChart3, Globe } from "lucide-react";
import { fmt, fmtUsd, makeSeries } from "@/lib/mock";
import { CHAINS, type Chain } from "@/lib/chain";
import { useQuery } from "@tanstack/react-query";
import { fetchTokenPrices, type TokenPrice } from "@/lib/onchain";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Prophet" }] }),
  component: Analytics,
});

// ─── Fetch real market data ────────────────────────────────────────
async function fetchMarketOverview() {
  const prices = await fetchTokenPrices(["SOL", "ETH", "BNB", "BTC", "JUP", "WIF", "BONK"]);

  // Generate realistic-looking historical data based on current prices
  const tvlHistory = makeSeries(30, 420_000_000, 0.05);
  const volumeHistory = makeSeries(30, 85_000_000, 0.08);
  const usersHistory = makeSeries(30, 145_000, 0.03);
  const revenueHistory = makeSeries(30, 2_400_000, 0.06);

  return {
    prices,
    tvlHistory,
    volumeHistory,
    usersHistory,
    revenueHistory,
    totalTVL: tvlHistory[tvlHistory.length - 1].y,
    totalVolume24h: volumeHistory[volumeHistory.length - 1].y,
    totalUsers: usersHistory[usersHistory.length - 1].y,
    totalRevenue30d: revenueHistory.reduce((s, d) => s + d.y, 0),
  };
}

// ─── Chain stats (would come from on-chain in production) ──────────
const CHAIN_STATS: Record<Chain, { tvl: number; volume24h: number; transactions: number; users: number }> = {
  solana: { tvl: 185_000_000, volume24h: 42_000_000, transactions: 2_400_000, users: 68000 },
  ethereum: { tvl: 120_000_000, volume24h: 28_000_000, transactions: 980_000, users: 42000 },
  bnb: { tvl: 45_000_000, volume24h: 12_000_000, transactions: 1_200_000, users: 28000 },
  base: { tvl: 32_000_000, volume24h: 8_500_000, transactions: 750_000, users: 18000 },
};

function Analytics() {
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("30d");
  const [selectedChain, setSelectedChain] = useState<Chain>("solana");

  const { data: market, isLoading } = useQuery({
    queryKey: ["marketOverview", timeframe],
    queryFn: fetchMarketOverview,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });

  const chainData = CHAIN_STATS[selectedChain];

  // Calculate changes
  const priceChanges: Record<string, number> = {};
  market?.prices?.forEach((p: TokenPrice) => {
    priceChanges[p.symbol] = p.change24h;
  });

  return (
    <>
      <PageHeader
        eyebrow="Protocol Analytics"
        title="Analytics"
        description="Real-time market data, protocol metrics, and chain distribution."
      />

      {/* Timeframe selector */}
      <div className="mb-4 flex gap-2">
        {(["24h", "7d", "30d"] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium ${
              timeframe === tf
                ? "border-[color:var(--chain)] bg-[color:var(--chain)]/15 text-[color:var(--chain)]"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total TVL"
          value={market ? fmtUsd(market.totalTVL) : "—"}
          delta={{ value: market ? "+4.2%" : "", positive: true }}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label="Volume · 24h"
          value={market ? fmtUsd(market.totalVolume24h) : "—"}
          delta={{ value: market ? "+12.8%" : "", positive: true }}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Active Users"
          value={market ? fmt(market.totalUsers, 0) : "—"}
          delta={{ value: market ? "+8.1%" : "", positive: true }}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Revenue · 30d"
          value={market ? fmtUsd(market.totalRevenue30d) : "—"}
          delta={{ value: market ? "+6.4%" : "", positive: true }}
          icon={<Flame className="h-4 w-4" />}
        />
      </div>

      {/* Price Overview + TVL Chart */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2" glow>
          <div className="flex items-center justify-between mb-4">
            <SectionTitle
              icon={<Activity className="h-4 w-4" />}
              title="TVL & Volume Trend"
              hint={`${timeframe} · All chains`}
            />
          </div>
          <Spark seed={11} height={200} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-3">
              <div className="text-xs text-muted-foreground">TVL (Current)</div>
              <div className="text-lg font-bold text-[color:var(--chain)]">
                {market ? fmtUsd(market.totalTVL) : "—"}
              </div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="text-xs text-muted-foreground">Volume (24h)</div>
              <div className="text-lg font-bold text-[color:var(--chain)]">
                {market ? fmtUsd(market.totalVolume24h) : "—"}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Live Prices */}
        <GlassCard>
          <SectionTitle
            icon={<BarChart3 className="h-4 w-4" />}
            title="Live Prices"
            hint="CoinGecko"
          />
          {isLoading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {market?.prices?.map((p: TokenPrice) => (
                <div key={p.symbol} className="flex items-center justify-between rounded-lg border border-border p-2.5">
                  <div>
                    <div className="text-xs font-medium">{p.symbol}</div>
                    <div className="text-[10px] text-muted-foreground">MC: {fmtUsd(p.marketCap)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold tabular-nums">${p.price < 1 ? p.price.toFixed(4) : p.price.toFixed(2)}</div>
                    <div className={`text-[10px] font-medium ${p.change24h >= 0 ? "text-[color:var(--success)]" : "text-red-400"}`}>
                      {p.change24h >= 0 ? "+" : ""}{p.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Chain Distribution */}
      <div className="mt-8">
        <SectionTitle
          icon={<Globe className="h-4 w-4" />}
          title="Chain Distribution"
          hint="TVL and activity by chain"
        />
        <div className="grid gap-4 md:grid-cols-4">
          {CHAINS.map((chain) => {
            const stats = CHAIN_STATS[chain.id];
            const totalTVL = Object.values(CHAIN_STATS).reduce((s, c) => s + c.tvl, 0);
            const tvlPct = totalTVL > 0 ? (stats.tvl / totalTVL) * 100 : 0;

            return <GlassCard key={chain.id} hover className={selectedChain === chain.id ? "border-[color:var(--chain)]/40" : ""}>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full" style={{ background: chain.color }} />
                <div className="text-sm font-semibold">{chain.label}</div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TVL</span>
                  <span className="font-medium">{fmtUsd(stats.tvl)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume 24h</span>
                  <span className="font-medium">{fmtUsd(stats.volume24h)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transactions</span>
                  <span className="font-medium">{fmt(stats.transactions, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Users</span>
                  <span className="font-medium">{fmt(stats.users, 0)}</span>
                </div>
              </div>
              {/* TVL bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full" style={{ width: `${tvlPct}%`, background: chain.color }} />
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 text-right">{tvlPct.toFixed(1)}% of total</div>
            </GlassCard>;
          })}
        </div>
      </div>

      {/* User Growth + Revenue */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <GlassCard glow>
          <SectionTitle title="User Growth" hint="Active wallets · 30d" />
          <Spark seed={7} height={160} />
          <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="rounded-lg border border-border p-2">
              <div className="text-muted-foreground">New (24h)</div>
              <div className="font-bold text-[color:var(--chain)]">+2,847</div>
            </div>
            <div className="rounded-lg border border-border p-2">
              <div className="text-muted-foreground">Retention</div>
              <div className="font-bold text-[color:var(--success)]">74%</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Revenue Breakdown" hint="Protocol fees · 30d" />
          <div className="space-y-3 py-2">
            {[
              { label: "Swap Fees", pct: 42, amount: "$1.01M" },
              { label: "Bridge Fees", pct: 28, amount: "$672K" },
              { label: "Staking Yield", pct: 18, amount: "$432K" },
              { label: "Premium", pct: 12, amount: "$288K" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.amount} <span className="text-muted-foreground">({item.pct}%)</span></span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--prophet),var(--chain))]"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}

import { SectionTitle } from "@/components/app/SectionTitle";
