import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { Brain, Coins, Users, Vote, Sparkles, Bell, Plus, Trash2, TrendingUp, AlertTriangle, Activity } from "lucide-react";
import { useNativeWallet, shortAddr } from "@/lib/use-native-wallet";
import { useTokenPrice } from "@/lib/useOnchain";
import { usePriceAlerts, useOnChainEvents, useWhaleAlerts, loadAlerts, addAlert, removeAlert, type PriceAlert } from "@/lib/notifications";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Prophet" }] }),
  component: Notif,
});

const TABS = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "price", label: "Price Alerts", icon: TrendingUp },
  { id: "onchain", label: "On-Chain", icon: Activity },
  { id: "whale", label: "Whale Watch", icon: AlertTriangle },
  { id: "friends", label: "Friends", icon: Users },
];

function Notif() {
  const { connected, publicKey } = useNativeWallet();
  const [tab, setTab] = useState("all");
  const [alerts, setAlerts] = useState<PriceAlert[]>(loadAlerts());
  const [newSymbol, setNewSymbol] = useState("SOL");
  const [newPrice, setNewPrice] = useState("");
  const [newDirection, setNewDirection] = useState<"above" | "below">("above");

  // Real data
  const { data: solPrice } = useTokenPrice("SOL");
  const { triggeredAlerts, prices } = usePriceAlerts(alerts);
  const { data: chainEvents } = useOnChainEvents(publicKey);
  const { data: whaleEvents } = useWhaleAlerts();

  const handleAddAlert = () => {
    const price = parseFloat(newPrice);
    if (!price || price <= 0) return;
    const alert = addAlert({ symbol: newSymbol.toUpperCase(), targetPrice: price, direction: newDirection });
    setAlerts((prev) => [...prev, alert]);
    setNewPrice("");
  };

  const handleRemoveAlert = (id: string) => {
    removeAlert(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const currentPrices = [
    { symbol: "SOL", price: solPrice },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Alert Center"
        title="Notifications"
        description={connected ? `Monitoring alerts for ${shortAddr(publicKey)}` : "Connect wallet for personalized alerts"}
      />

      {/* Live Price Ticker */}
      <div className="mb-4 flex gap-3 overflow-x-auto pb-1">
        {currentPrices.map((p) => (
          <div key={p.symbol} className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface-1/60 px-3 py-1.5 text-xs">
            <span className="font-medium">{p.symbol}</span>
            <span className="tabular-nums text-[color:var(--chain)]">
              {p.price ? `$${p.price < 1 ? p.price.toFixed(4) : p.price.toFixed(2)}` : "—"}
            </span>
          </div>
        ))}
      </div>

      {/* Triggered Alerts */}
      {triggeredAlerts.length > 0 && (
        <div className="mb-4 space-y-2">
          {triggeredAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3">
              <Bell className="h-4 w-4 text-yellow-400 shrink-0" />
              <div className="flex-1 text-xs">
                <span className="font-medium">{alert.symbol}</span> is {alert.direction === "above" ? "above" : "below"}{" "}
                <span className="text-[color:var(--chain)]">${alert.targetPrice}</span>
                {prices[alert.symbol.toUpperCase()] && (
                  <span className="text-muted-foreground"> (current: ${prices[alert.symbol.toUpperCase()].toFixed(2)})</span>
                )}
              </div>
              <button onClick={() => handleRemoveAlert(alert.id)} className="text-muted-foreground hover:text-foreground">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
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

      {/* Price Alert Creator */}
      {(tab === "price" || tab === "all") && (
        <GlassCard className="mb-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <Plus className="h-3.5 w-3.5" /> Create Price Alert
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="rounded-lg border border-border bg-surface-2/60 px-2 py-1.5 text-sm"
            >
              {["SOL", "ETH", "BNB", "JUP", "WIF", "BONK", "USDC"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={newDirection}
              onChange={(e) => setNewDirection(e.target.value as "above" | "below")}
              className="rounded-lg border border-border bg-surface-2/60 px-2 py-1.5 text-sm"
            >
              <option value="above">Goes above</option>
              <option value="below">Drops below</option>
            </select>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder={solPrice?.toFixed(2) || "0.00"}
                className="h-8 w-24 rounded-lg border border-border bg-surface-1/60 pl-5 pr-2 text-sm tabular-nums outline-none focus:border-[color:var(--chain)]"
              />
            </div>
            <button
              onClick={handleAddAlert}
              disabled={!newPrice || parseFloat(newPrice) <= 0}
              className="h-8 rounded-lg bg-[color:var(--chain)]/20 px-3 text-xs font-medium text-[color:var(--chain)] hover:bg-[color:var(--chain)]/30 disabled:opacity-50"
            >
              Add Alert
            </button>
          </div>

          {/* Active Alerts List */}
          {alerts.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {alerts.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-border bg-surface-1/40 px-3 py-2 text-xs">
                  <span>
                    <span className="font-medium">{a.symbol}</span>{" "}
                    {a.direction === "above" ? "≥" : "≤"}{" "}
                    <span className="text-[color:var(--chain)]">${a.targetPrice}</span>
                    {prices[a.symbol.toUpperCase()] && (
                      <span className="text-muted-foreground ml-2">
                        (now: ${prices[a.symbol.toUpperCase()]?.toFixed(2)})
                      </span>
                    )}
                  </span>
                  <button onClick={() => handleRemoveAlert(a.id)} className="text-muted-foreground hover:text-red-400">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}

      {/* On-Chain Events */}
      {(tab === "onchain" || tab === "all") && (
        <GlassCard className="mb-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <Activity className="h-3.5 w-3.5" /> On-Chain Activity
          </div>
          {connected ? (
            chainEvents && chainEvents.length > 0 ? (
              <ul className="divide-y divide-border">
                {chainEvents.slice(0, 10).map((evt: any) => (
                  <li key={evt.id} className="flex items-start gap-3 py-3 text-sm">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--chain)] shrink-0" />
                    <div className="flex-1">
                      <div className="text-foreground/90">{evt.description}</div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground font-mono">
                        {evt.source} · {new Date(evt.timestamp * 1000).toLocaleString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">Loading on-chain events...</div>
            )
          ) : (
            <div className="py-6 text-center text-xs text-muted-foreground">Connect wallet to view your on-chain activity</div>
          )}
        </GlassCard>
      )}

      {/* Whale Alerts */}
      {(tab === "whale" || tab === "all") && (
        <GlassCard>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5" /> Whale Watch
          </div>
          {whaleEvents && whaleEvents.length > 0 ? (
            <ul className="divide-y divide-border">
              {whaleEvents.map((evt: any) => (
                <li key={evt.id} className="flex items-start gap-3 py-3 text-sm">
                  <span className="mt-1 text-lg">🐋</span>
                  <div className="flex-1">
                    <div className="text-foreground/90">{evt.description}</div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground">
                      {evt.source} · {evt.value}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-6 text-center text-xs text-muted-foreground">
              Monitoring whale transactions across Solana...
            </div>
          )}
        </GlassCard>
      )}

      {/* Friends (placeholder) */}
      {tab === "friends" && (
        <GlassCard className="py-12 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground opacity-50" />
          <div className="text-sm text-muted-foreground">Social features coming soon</div>
          <div className="mt-1 text-xs text-muted-foreground">Follow traders, share alpha, build your reputation</div>
        </GlassCard>
      )}
    </>
  );
}
