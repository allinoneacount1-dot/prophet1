import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Coins, Globe2, Lock, Network, Sparkles, Zap } from "lucide-react";
import { BuyProphetButton } from "@/components/app/BuyProphetButton";
import { LiveTicker } from "@/components/app/LiveTicker";
import { Spark } from "@/components/app/Spark";
import { useLivePrice, fmtUsd } from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ProphetSol — AI Multi-Chain Wealth OS" },
      { name: "description", content: "Institutional-grade Web3 OS combining DeAI, DeFi, SocialFi, DePIN, DAO, and Gaming across Solana, BNB, Base, and Ethereum." },
      { property: "og:title", content: "ProphetSol — AI Multi-Chain Wealth OS" },
      { property: "og:description", content: "Trade, stake, vote, and earn across chains — powered by DeAI." },
    ],
  }),
  component: Index,
});

function Index() {
  const price = useLivePrice(2.847, 0.006);
  const tvl = useLivePrice(284_320_000, 0.002);
  const burned = useLivePrice(42_180_000, 0.001);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--chain),transparent)] opacity-30 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-9 w-9 rounded-lg bg-[linear-gradient(135deg,var(--prophet),var(--chain))] chain-glow">
            <div className="absolute inset-0 grid place-items-center text-sm font-black text-primary-foreground">Ψ</div>
          </div>
          <div>
            <div className="text-sm font-bold leading-none">ProphetSol</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Wealth OS · v2.0</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to="/deai" className="hover:text-foreground">DeAI</Link>
          <Link to="/staking" className="hover:text-foreground">Staking</Link>
          <Link to="/depin" className="hover:text-foreground">DePIN</Link>
          <Link to="/governance" className="hover:text-foreground">DAO</Link>
          <Link to="/docs" className="hover:text-foreground">Docs</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth" className="rounded-lg border border-border bg-surface-1/60 px-4 py-2 text-sm hover:bg-white/5">Sign in</Link>
          <BuyProphetButton size="sm" />
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-10 md:pt-20">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--chain)]/30 bg-[color:var(--chain)]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-[color:var(--chain)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--chain)] chain-glow" />
          Live on Solana · BNB · Base · Ethereum
        </div>
        <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          The AI-Powered <span className="text-gradient-chain">Multi-Chain</span><br /> Wealth Operating System.
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
          ProphetSol unifies DeAI, DeFi, SocialFi, DePIN, DAO, and Gaming into one institutional-grade terminal — designed for the next billion on-chain users.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/dashboard" className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-transform hover:scale-[1.02]">
            Launch App <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <BuyProphetButton size="lg" />
        </div>

        <div className="mt-10"><LiveTicker /></div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "$PROPHET Price", value: fmtUsd(price), spark: 1 },
            { label: "Total Value Locked", value: fmtUsd(tvl), spark: 2 },
            { label: "$PROPHET Burned", value: fmtUsd(burned), spark: 3 },
            { label: "AI Prediction Accuracy", value: "94.2%", spark: 4 },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
              <div className="mt-2 text-2xl font-semibold tabular-nums">{s.value}</div>
              <div className="mt-2"><Spark seed={s.spark} height={36} /></div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-24 max-w-7xl px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-[color:var(--chain)]">The Operating System</div>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">One terminal. Every primitive.</h2>
          </div>
          <Link to="/dashboard" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline">Explore all modules →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { to: "/deai", icon: Brain, title: "DeAI Hub", desc: "On-chain intelligence, Early Gem Radar, AI vaults." },
            { to: "/staking", icon: Coins, title: "Staking & Yield", desc: "Cross-chain staking with interactive APY calculator." },
            { to: "/depin", icon: Network, title: "DePIN Network", desc: "Global node map and physical infrastructure ROI." },
            { to: "/socialfi", icon: Globe2, title: "SocialFi", desc: "Reputation, badges, leaderboards, referrals." },
            { to: "/governance", icon: Lock, title: "DAO Governance", desc: "Vote, propose, and shape the protocol." },
            { to: "/arcade", icon: Zap, title: "Arcade", desc: "Web3 mini-games with $PROPHET rewards." },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.to} to={m.to} className="group relative overflow-hidden rounded-2xl border border-border bg-surface-1/40 p-6 transition-all hover:-translate-y-1 hover:border-[color:var(--chain)]/40 hover:chain-glow">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--chain)]/15 text-[color:var(--chain)]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-base font-semibold">{m.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs text-[color:var(--chain)]">
                  Open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-24 max-w-5xl px-6 pb-20">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,var(--chain)/0.25,transparent)]" />
          <Sparkles className="relative mx-auto h-8 w-8 text-[color:var(--chain)]" />
          <h3 className="relative mt-4 text-3xl font-bold md:text-4xl">Step into the <span className="text-gradient-chain">Prophet Era</span>.</h3>
          <p className="relative mx-auto mt-3 max-w-xl text-sm text-muted-foreground">Connect a wallet or sign up with email — Smart Account & gasless transactions included.</p>
          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/auth" className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:scale-[1.02]">Get Started</Link>
            <BuyProphetButton />
          </div>
        </div>
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} ProphetSol. All rights reserved.</div>
          <div className="flex gap-4">
            <Link to="/docs">Docs</Link>
            <Link to="/governance">DAO</Link>
            <Link to="/security">Security</Link>
          </div>
        </footer>
      </section>
    </div>
  );
}