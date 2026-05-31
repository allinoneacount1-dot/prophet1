import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { Switch } from "@/components/ui/switch";
import { CHAINS, useChain, type Chain } from "@/lib/chain";
import { useState } from "react";
import { toast } from "sonner";
import {
  Wallet,
  Bell,
  Globe,
  Shield,
  Moon,
  Sun,
  Copy,
  Check,
  ExternalLink,
  LogOut,
  Settings,
  Link2,
  Unlink,
  ChevronRight,
} from "lucide-react";
import { useNativeWallet, shortAddr } from "@/lib/use-native-wallet";
import { useQuery } from "@tanstack/react-query";
import { fetchPortfolio } from "@/lib/onchain";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — Prophet" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { chain, setChain, connected: chainConnected } = useChain();
  const { connected, publicKey, selectedWallet, connecting, wallets, connect, disconnect } = useNativeWallet();
  const [notifPrefs, setNotifPrefs] = useState({
    ai: true,
    staking: true,
    governance: true,
    friends: false,
    priceAlerts: true,
    whaleAlerts: true,
  });
  const [darkMode, setDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);

  const { data: portfolio } = useQuery({
    queryKey: ["settingsPortfolio", publicKey],
    queryFn: () => fetchPortfolio(publicKey!),
    enabled: !!publicKey,
    staleTime: 30_000,
  });

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleChainSwitch = (newChain: Chain) => {
    setChain(newChain);
    toast.success(`Switched to ${CHAINS.find((c) => c.id === newChain)?.label}`);
  };

  return (
    <>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Manage wallet, chain, notifications, and display preferences."
      />

      {/* Wallet Management */}
      <GlassCard glow className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="h-5 w-5 text-[color:var(--chain)]" />
          <div className="text-sm font-semibold">Wallet</div>
        </div>

        {connected && publicKey ? (
          <div className="space-y-4">
            {/* Connected wallet info */}
            <div className="flex items-center gap-3 rounded-xl border border-[color:var(--chain)]/20 bg-[color:var(--chain)]/5 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--chain)]/15 text-lg">
                {wallets.find((w) => w.key === selectedWallet)?.icon || "🔗"}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {wallets.find((w) => w.key === selectedWallet)?.name || "Wallet"} · {shortAddr(publicKey)}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />
                  Connected
                  {portfolio && (
                    <span className="text-[color:var(--chain)]">
                      · {portfolio.solBalance.toFixed(2)} SOL
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="rounded-lg border border-border p-2 hover:bg-white/5"
                  title="Copy address"
                >
                  {copied ? <Check className="h-4 w-4 text-[color:var(--success)]" /> : <Copy className="h-4 w-4" />}
                </button>
                <a
                  href={`https://solscan.io/account/${publicKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border p-2 hover:bg-white/5"
                  title="View on Solscan"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={disconnect}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                  title="Disconnect"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Wallet balance breakdown */}
            {portfolio && (
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg border border-border p-2">
                  <div className="text-muted-foreground">Balance</div>
                  <div className="font-bold text-[color:var(--chain)]">{portfolio.solBalance.toFixed(4)} SOL</div>
                </div>
                <div className="rounded-lg border border-border p-2">
                  <div className="text-muted-foreground">Tokens</div>
                  <div className="font-bold">{portfolio.tokenBalances.length}</div>
                </div>
                <div className="rounded-lg border border-border p-2">
                  <div className="text-muted-foreground">Value</div>
                  <div className="font-bold">${portfolio.totalValue.toFixed(2)}</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">Connect a wallet to access all features</div>
            <div className="grid grid-cols-2 gap-2">
              {wallets.map((w) => (
                <button
                  key={w.key}
                  onClick={() => w.ready && connect(w.key)}
                  disabled={!w.ready || connecting}
                  className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm hover:border-[color:var(--chain)]/30 hover:bg-white/5 disabled:opacity-40"
                >
                  <span className="text-lg">{w.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-xs">{w.name}</div>
                    {!w.ready && <div className="text-[9px] text-yellow-400">Not installed</div>}
                  </div>
                  {w.ready ? (
                    <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <a
                      href={w.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] text-[color:var(--chain)] hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Install
                    </a>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Chain Selector */}
      <GlassCard className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-[color:var(--chain)]" />
          <div className="text-sm font-semibold">Active Chain</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CHAINS.map((c) => (
            <button
              key={c.id}
              onClick={() => handleChainSwitch(c.id)}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                chain === c.id
                  ? "border-[color:var(--chain)] bg-[color:var(--chain)]/5"
                  : "border-border bg-surface-1/40 hover:border-[color:var(--chain)]/20"
              }`}
            >
              <span className="h-3 w-3 rounded-full" style={{ background: c.color }} />
              <div className="text-left">
                <div className="text-sm font-medium">{c.label}</div>
                <div className="text-[10px] text-muted-foreground">{c.symbol}</div>
              </div>
              {chain === c.id && <Check className="h-4 w-4 text-[color:var(--chain)] ml-auto" />}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Notification Preferences */}
      <GlassCard className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-[color:var(--chain)]" />
          <div className="text-sm font-semibold">Notifications</div>
        </div>
        <div className="space-y-3">
          {[
            { key: "ai" as const, label: "AI Signals", desc: "Alpha alerts and market predictions" },
            { key: "staking" as const, label: "Staking", desc: "Rewards, unstake ready, APY changes" },
            { key: "governance" as const, label: "Governance", desc: "New proposals and voting reminders" },
            { key: "priceAlerts" as const, label: "Price Alerts", desc: "Your custom price triggers" },
            { key: "whaleAlerts" as const, label: "Whale Alerts", desc: "Large transaction notifications" },
            { key: "friends" as const, label: "Social", desc: "Referral and leaderboard updates" },
          ].map((pref) => (
            <div key={pref.key} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <div className="text-sm font-medium">{pref.label}</div>
                <div className="text-[10px] text-muted-foreground">{pref.desc}</div>
              </div>
              <Switch
                checked={notifPrefs[pref.key]}
                onCheckedChange={(v) => setNotifPrefs((p) => ({ ...p, [pref.key]: v }))}
                className="data-[state=checked]:bg-[color:var(--chain)]"
              />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Display */}
      <GlassCard className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-[color:var(--chain)]" />
          <div className="text-sm font-semibold">Display</div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div className="flex items-center gap-2">
            {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <div>
              <div className="text-sm font-medium">Dark Mode</div>
              <div className="text-[10px] text-muted-foreground">Easier on the eyes</div>
            </div>
          </div>
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            className="data-[state=checked]:bg-[color:var(--chain)]"
          />
        </div>
      </GlassCard>

      {/* Quick Links */}
      <GlassCard>
        <div className="text-sm font-semibold mb-4">Quick Links</div>
        <div className="space-y-1">
          {[
            { label: "Solscan", url: `https://solscan.io/account/${publicKey || ""}`, icon: ExternalLink },
            { label: "Realms Governance", url: "https://app.realms.today", icon: Globe },
            { label: "RugCheck", url: "https://rugcheck.xyz", icon: Shield },
            { label: "Helius Explorer", url: `https://xray.helius.xyz/account/${publicKey || ""}`, icon: ExternalLink },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg p-2.5 text-sm hover:bg-white/5"
              >
                <span>{link.label}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </a>
            );
          })}
        </div>
      </GlassCard>
    </>
  );
}
