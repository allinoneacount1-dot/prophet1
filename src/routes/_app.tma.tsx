// ─── Telegram Mini App Page ─────────────────────────────────────────
// Route: /tma — mobile-first TWA with bottom tab navigation

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Home, LayoutDashboard, ArrowDownUp, Coins, User } from "lucide-react";
import { useNativeWallet, shortAddr } from "@/lib/use-native-wallet";
import { useQuery } from "@tanstack/react-query";
import { fetchPortfolio, fetchSinglePrice } from "@/lib/onchain";
import { useJupiterQuote } from "@/lib/useOnchain";
import { fmtUsd } from "@/lib/mock";

export const Route = createFileRoute("/_app/tma")({
  head: () => ({ meta: [{ title: "Prophet TMA" }] }),
  component: TMAPage,
});

type TMATab = "home" | "dashboard" | "swap" | "staking" | "profile";

function useTelegramWebApp() {
  const [isTMA, setIsTMA] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.initData) {
      setIsTMA(true);
      tg.ready();
      tg.expand();
      setUser(tg.initDataUnsafe?.user || null);
    }
    setReady(true);
  }, []);

  return { isTMA, user, ready };
}

function TMA_TAB_BAR({ active, onSelect }: { active: TMATab; onSelect: (t: TMATab) => void }) {
  const tabs: { id: TMATab; label: string; icon: typeof Home }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "dashboard", label: "Portfolio", icon: LayoutDashboard },
    { id: "swap", label: "Swap", icon: ArrowDownUp },
    { id: "staking", label: "Stake", icon: Coins },
    { id: "profile", label: "Profile", icon: User },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button key={tab.id} onClick={() => onSelect(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] transition-colors ${isActive ? "text-[#14F195]" : "text-muted-foreground"}`}
              style={{ WebkitTapHighlightColor: "transparent" }}>
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
              {isActive && <div style={{ height: 2, width: 16, borderRadius: 2, background: "#14F195", marginTop: 2 }} />}
            </button>
          );
        })}
      </div>
      <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
    </div>
  );
}

function toast(msg: string) {
  try {
    const el = document.createElement("div");
    el.textContent = msg;
    el.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(20,241,149,0.9);color:#000;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;z-index:9999;white-space:nowrap";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  } catch {}
}

// ─── TMA Home ──────────────────────────────────────────────────────
function TMAHome({ onNavigate }: { onNavigate: (t: TMATab) => void }) {
  const { connected, publicKey } = useNativeWallet();
  const { data: solPrice } = useQuery({ queryKey: ["tmaSolPrice"], queryFn: () => fetchSinglePrice("SOL"), staleTime: 15000 });
  const { data: portfolio } = useQuery({ queryKey: ["tmaPortfolio", publicKey], queryFn: () => fetchPortfolio(publicKey!), enabled: !!publicKey, staleTime: 15000 });

  return (
    <div className="p-4 space-y-4">
      <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(20,241,149,0.1), rgba(153,69,255,0.1))", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="text-3xl mb-2">🔮</div>
        <h1 className="text-xl font-bold">Prophet DeFi</h1>
        <p className="text-xs text-muted-foreground mt-1">Trade, stake, and earn — right inside Telegram.</p>
        {!connected && <div className="mt-3 rounded-lg p-3 text-xs" style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)", color: "#EAB308" }}>Connect wallet to get started</div>}
      </div>
      <div className="rounded-xl p-4" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
        <div className="flex items-center justify-between">
          <div><div className="text-xs text-muted-foreground">SOL Price</div><div className="text-2xl font-bold tabular-nums text-[#14F195]">{solPrice ? `$${solPrice.toFixed(2)}` : "—"}</div></div>
          <div className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: "rgba(20,241,149,0.1)", color: "#14F195" }}>Live</div>
        </div>
      </div>
      {connected && portfolio && (
        <div className="rounded-xl p-4" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center justify-between mb-3"><div className="text-sm font-medium">Your Portfolio</div><button onClick={() => onNavigate("dashboard")} className="text-xs text-[#14F195]">View all →</button></div>
          <div className="text-2xl font-bold tabular-nums">${portfolio.totalValue.toFixed(2)}</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.05)" }}><div className="text-muted-foreground">SOL</div><div className="font-medium">{portfolio.solBalance.toFixed(4)}</div></div>
            <div className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.05)" }}><div className="text-muted-foreground">Tokens</div><div className="font-medium">{portfolio.tokenBalances.length}</div></div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onNavigate("swap")} className="flex items-center gap-3 rounded-xl p-4 hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}><span className="text-xl">💱</span><div className="text-left"><div className="text-sm font-medium">Swap</div><div className="text-[10px] text-muted-foreground">Jupiter</div></div></button>
        <button onClick={() => onNavigate("staking")} className="flex items-center gap-3 rounded-xl p-4 hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}><span className="text-xl">💰</span><div className="text-left"><div className="text-sm font-medium">Stake</div><div className="text-[10px] text-muted-foreground">Native SOL</div></div></button>
      </div>
      <div className="text-center text-[10px] text-muted-foreground py-4">Prophet TMA · v1.0 · Solana</div>
    </div>
  );
}

// ─── TMA Dashboard ─────────────────────────────────────────────────
function TMADashboard() {
  const { connected, publicKey } = useNativeWallet();
  const { data: portfolio, isLoading } = useQuery({ queryKey: ["tmaPortfolio", publicKey], queryFn: () => fetchPortfolio(publicKey!), enabled: !!publicKey, staleTime: 15000 });

  if (!connected) return <div className="p-4 flex items-center justify-center min-h-[60vh]"><div className="text-center"><div className="text-4xl mb-3">👛</div><div className="text-sm font-medium">Connect Wallet</div></div></div>;
  if (isLoading) return <div className="p-4 space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 animate-pulse rounded-xl bg-white/5" />)}</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="text-sm font-medium">Portfolio</div>
      <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(20,241,149,0.1), rgba(153,69,255,0.1))", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="text-xs text-muted-foreground">Total Value</div>
        <div className="text-3xl font-bold tabular-nums mt-1">{fmtUsd(portfolio?.totalValue || 0)}</div>
      </div>
      <div className="rounded-xl p-4" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
        <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="text-xl">◎</span><div><div className="text-sm font-medium">SOL</div><div className="text-xs text-muted-foreground">Solana</div></div></div><div className="text-right"><div className="text-sm font-bold tabular-nums">{portfolio?.solBalance.toFixed(4) || "0"}</div></div></div>
      </div>
      {portfolio?.tokenBalances?.length > 0 && portfolio.tokenBalances.map((t: any) => (
        <div key={t.symbol} className="flex items-center justify-between rounded-xl p-3" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
          <div><div className="text-xs font-medium">{t.symbol}</div><div className="text-[10px] text-muted-foreground">{t.amount.toFixed(4)}</div></div>
          <div className="text-right"><div className="text-xs font-bold tabular-nums">${t.price.toFixed(4)}</div><div className="text-[10px] text-muted-foreground">{fmtUsd(t.value)}</div></div>
        </div>
      ))}
    </div>
  );
}

// ─── TMA Swap ──────────────────────────────────────────────────────
function TMASwap() {
  const [from, setFrom] = useState("SOL");
  const [to, setTo] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [swapping, setSwapping] = useState(false);
  const TOKENS=*** { symbol: "SOL", mint: "So11111111111111111111111111111111111111112", decimals: 9 }, { symbol: "USDC", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6 }];
  const numAmt = parseFloat(amount) || 0;
  const toToken = TOKENS.find((t) => t.symbol === to)!;
  const { data: quote, isLoading: quoting } = useJupiterQuote(TOKENS.find((t) => t.symbol === from)?.mint || null, toToken?.mint || null, numAmt, 9);
  const estimated = quote?.outAmount && toToken ? (quote.outAmount / Math.pow(10, toToken.decimals)).toFixed(4) : "—";
  const { connected, publicKey } = useNativeWallet();

  const handleSwap = async () => {
    if (!connected) { toast("Connect wallet first"); return; }
    if (!quote || numAmt <= 0) { toast("Enter valid amount"); return; }
    setSwapping(true);
    try {
      toast(`Swap: ${numAmt} ${from} → ${estimated} ${to}`);
    } finally { setSwapping(false); }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-sm font-medium">Swap</div>
      <div className="rounded-xl p-4" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
        <div className="text-xs text-muted-foreground mb-2">From</div>
        <div className="flex items-center justify-between">
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.0" type="number" className="bg-transparent text-2xl font-bold tabular-nums outline-none w-full" />
          <select value={from} onChange={(e) => setFrom(e.target.value)} style={{ color: "#fff", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 12px", fontSize: 14, fontWeight: 500 }}>{TOKENS.map((t) => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}</select>
        </div>
      </div>
      <div className="flex justify-center"><button onClick={() => { setFrom(to); setTo(from); }} className="grid h-10 w-10 place-items-center rounded-full bg-white/5 border border-white/10"><ArrowDownUp className="h-4 w-4" /></button></div>
      <div className="rounded-xl p-4" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
        <div className="flex items-center justify-between mb-2"><span className="text-xs text-muted-foreground">To (est.)</span>{quoting && <span className="text-[10px] text-muted-foreground animate-pulse">…</span>}</div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold tabular-nums text-[#14F195]">{estimated}</div>
          <select value={to} onChange={(e) => setTo(e.target.value)} style={{ color: "#fff", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 12px", fontSize: 14, fontWeight: 500 }}>{TOKENS.filter((t) => t.symbol !== from).map((t) => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}</select>
        </div>
      </div>
      {quote && <div className="rounded-lg p-3 text-xs text-muted-foreground space-y-1" style={{ background: "rgba(255,255,255,0.05)" }}><div className="flex justify-between"><span>Impact</span><span className={Number(quote.priceImpactPct)>3?"text-yellow-400":"text-[#14F195]"}>{Number(quote.priceImpactPct).toFixed(2)}%</span></div></div>}
      <button onClick={handleSwap} disabled={swapping || !quote || numAmt <= 0} className="w-full h-12 rounded-xl font-bold text-sm disabled:opacity-50" style={{ background: "linear-gradient(135deg, #14F195, #9945FF)" }}>{swapping ? "…" : "Swap via Jupiter"}</button>
    </div>
  );
}

// ─── TMA Profile ───────────────────────────────────────────────────
function TMAProfileView() {
  const { connected, publicKey, disconnect } = useNativeWallet();
  const [copied, setCopied] = useState(false);
  const { data: portfolio } = useQuery({ queryKey: ["tmaPortfolio", publicKey], queryFn: () => fetchPortfolio(publicKey!), enabled: !!publicKey });
  const level = portfolio ? Math.min(1 + (portfolio.solBalance > 0 ? 5 : 0) + (portfolio.solBalance > 1 ? 10 : 0) + (portfolio.tokenBalances.length > 0 ? 5 : 0) + (portfolio.totalValue > 1000 ? 10 : 0), 100) : 1;
  const rank = ["Explorer","Seeker","Analyst","Oracle","Prophet","ArchProphet"][Math.min(5, Math.floor(level / 20))];

  return (
    <div className="p-4 space-y-4">
      <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(20,241,149,0.1), rgba(153,69,255,0.1))", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full text-2xl" style={{ background: "rgba(20,241,149,0.15)" }}>🔮</div>
          <div className="flex-1"><div className="text-lg font-bold">{rank}</div><div className="text-xs text-muted-foreground">Level {level} · {connected && publicKey ? shortAddr(publicKey) : "Not connected"}</div></div>
        </div>
      </div>
      {connected && portfolio && (
        <div className="grid grid-cols-2 gap-3">
          {[["Portfolio", fmtUsd(portfolio.totalValue)], ["SOL", portfolio.solBalance.toFixed(4)], ["Tokens", String(portfolio.tokenBalances.length)], ["Badges", String(Math.max(1, Math.floor(level/10)))]].map(([l, v]) => (
            <div key={l} className="rounded-xl p-3 text-center" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}><div className="text-xs text-muted-foreground">{l}</div><div className="text-lg font-bold text-[#14F195]">{v}</div></div>
          ))}
        </div>
      )}
      {connected && <button onClick={disconnect} className="w-full flex items-center justify-center gap-2 rounded-xl p-3 text-sm text-red-400" style={{ border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>Disconnect Wallet</button>}
      <div className="text-center text-[10px] text-muted-foreground py-4">Prophet TMA · v1.0</div>
    </div>
  );
}

// ─── Main TMA Page ─────────────────────────────────────────────────
function TMAPage() {
  const { isTMA, user, ready } = useTelegramWebApp();
  const [tab, setTab] = useState<TMATab>("home");

  if (!ready) {
    return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center"><div className="text-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#14F195] border-t-transparent mx-auto mb-3" /><div className="text-sm text-muted-foreground">Loading…</div></div></div>;
  }

  if (!isTMA) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <div className="text-4xl">📱</div>
          <div className="text-lg font-bold">Telegram Mini App</div>
          <div className="text-sm text-muted-foreground max-w-xs mx-auto">Open inside Telegram or continue as web app.</div>
          <button onClick={() => setTab("home")} className="rounded-xl px-6 py-3 font-bold text-sm text-white" style={{ background: "linear-gradient(135deg, #14F195, #9945FF)" }}>Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col max-w-lg mx-auto">
      <div className="sticky top-0 z-50 px-4 py-3" style={{ background: "rgba(10,10,15,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><span className="text-lg">🔮</span><span className="font-bold text-sm">Prophet</span></div>
          {user && <div className="flex items-center gap-2"><div className="grid h-7 w-7 place-items-center rounded-full text-xs font-bold" style={{ background: "rgba(20,241,149,0.15)", color: "#14F195" }}>{user.firstName?.[0]||"?"}</div><span className="text-xs text-muted-foreground">@{user.username||"user"}</span></div>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-20">
        {tab === "home" && <TMAHome onNavigate={setTab} />}
        {tab === "dashboard" && <TMADashboard />}
        {tab === "swap" && <TMASwap />}
        {tab === "staking" && <TMADashboard />}
        {tab === "profile" && <TMAProfileView />}
      </div>
      <TMA_TAB_BAR active={tab} onSelect={setTab} />
    </div>
  );
}
