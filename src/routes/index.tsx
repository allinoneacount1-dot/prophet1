import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Coins, Globe2, Lock, Network, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { BuyProphetButton } from "@/components/app/BuyProphetButton";
import { LiveTicker } from "@/components/app/LiveTicker";
import { Spark } from "@/components/app/Spark";
import { ConnectWallet } from "@/components/app/ConnectWallet";
import { useLivePrice, fmtUsd } from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prophet — AI Multi-Chain Wealth OS" },
      {
        name: "description",
        content:
          "Institutional-grade Web3 OS combining DeAI, DeFi, SocialFi, DePIN, DAO, and Gaming across Solana, BNB, Base, and Ethereum.",
      },
      { property: "og:title", content: "Prophet — AI Multi-Chain Wealth OS" },
      { property: "og:description", content: "Trade, stake, vote, and earn across chains — powered by DeAI." },
    ],
  }),
  component: Index,
});

function Index() {
  const price = useLivePrice(2.847, 0.006);
  const tvl = useLivePrice(284_320_000, 0.002);
  const burned = useLivePrice(42_180_000, 0.001);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--chain),transparent)] opacity-30 blur-3xl" />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5"
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-12 w-12 overflow-hidden">
            <img 
              src="/prophet-logo.png" 
              alt="Prophet Logo" 
              className="h-full w-full object-contain"
              style={{ aspectRatio: '1/1' }}
            />
          </div>
          <div>
            <div className="text-sm font-bold leading-none">Prophet</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Wealth OS · v2.0
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to="/deai" className="hover:text-foreground">
            DeAI
          </Link>
          <Link to="/staking" className="hover:text-foreground">
            Staking
          </Link>
          <Link to="/depin" className="hover:text-foreground">
            DePIN
          </Link>
          <Link to="/governance" className="hover:text-foreground">
            DAO
          </Link>
          <Link to="/docs" className="hover:text-foreground">
            Docs
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ConnectWallet />
          <BuyProphetButton size="sm" />
        </div>
      </motion.header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-10 md:pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--chain)]/30 bg-[color:var(--chain)]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-[color:var(--chain)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--chain)] chain-glow" />
          Live on Solana · BNB · Base · Ethereum
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
        >
          The AI-Powered <span className="text-gradient-chain">Multi-Chain</span>
          <br /> Wealth Operating System.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg"
        >
          Prophet unifies DeAI, DeFi, SocialFi, DePIN, DAO, and Gaming into one
          institutional-grade terminal — designed for the next billion on-chain users.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link
            to="/dashboard"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
          >
            Launch App{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <BuyProphetButton size="lg" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10"
        >
          <LiveTicker />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            { label: "$PROPHET Price", value: fmtUsd(price), spark: 1 },
            { label: "Total Value Locked", value: fmtUsd(tvl), spark: 2 },
            { label: "$PROPHET Burned", value: fmtUsd(burned), spark: 3 },
            { label: "AI Prediction Accuracy", value: "94.2%", spark: 4 },
          ].map((s) => (
            <motion.div
              key={s.label}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass rounded-2xl p-5"
            >
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-2 text-2xl font-semibold tabular-nums">{s.value}</div>
              <div className="mt-2">
                <Spark seed={s.spark} height={36} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto mt-24 max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <div className="text-xs uppercase tracking-widest text-[color:var(--chain)]">
              The Operating System
            </div>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">One terminal. Every primitive.</h2>
          </div>
          <Link
            to="/dashboard"
            className="hidden text-sm text-muted-foreground hover:text-foreground md:inline"
          >
            Explore all modules →
          </Link>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {[
            {
              to: "/deai",
              icon: Brain,
              title: "DeAI Hub",
              desc: "On-chain intelligence, Early Gem Radar, AI vaults.",
            },
            {
              to: "/staking",
              icon: Coins,
              title: "Staking & Yield",
              desc: "Cross-chain staking with interactive APY calculator.",
            },
            {
              to: "/depin",
              icon: Network,
              title: "DePIN Network",
              desc: "Global node map and physical infrastructure ROI.",
            },
            {
              to: "/socialfi",
              icon: Globe2,
              title: "SocialFi",
              desc: "Reputation, badges, leaderboards, referrals.",
            },
            {
              to: "/governance",
              icon: Lock,
              title: "DAO Governance",
              desc: "Vote, propose, and shape the protocol.",
            },
            {
              to: "/arcade",
              icon: Zap,
              title: "Arcade",
              desc: "Web3 mini-games with $PROPHET rewards.",
            },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.to}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link
                  to={m.to}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-surface-1/40 p-6 transition-all hover:border-[color:var(--chain)]/40 hover:chain-glow"
                >
                  <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-[color:var(--chain)]/10 blur-3xl" />
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--chain)]/15 text-[color:var(--chain)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-lg font-semibold">{m.title}</div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[color:var(--chain)]/10 px-4 py-2 text-xs font-medium text-[color:var(--chain)] transition-all group-hover:bg-[color:var(--chain)]/20">
                    <span>Open</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto mt-24 max-w-5xl px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,var(--chain)/0.25,transparent)]" />
          <Sparkles className="relative mx-auto h-8 w-8 text-[color:var(--chain)]" />
          <h3 className="relative mt-4 text-3xl font-bold md:text-4xl">
            Step into the <span className="text-gradient-chain">Prophet Era</span>.
          </h3>
          <p className="relative mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Connect a wallet or sign up with email — Smart Account & gasless transactions included.
          </p>
          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:scale-[1.02]"
            >
              Get Started
            </Link>
            <BuyProphetButton />
          </div>
        </motion.div>
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Prophet. All rights reserved.</div>
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
