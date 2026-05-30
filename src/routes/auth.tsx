import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail, Sparkles, Wallet as WalletIcon, Zap, ShieldCheck } from "lucide-react";
import { WALLETS, useChain } from "@/lib/chain";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — ProphetSol" },
      { name: "description", content: "Connect a Web3 wallet or sign in with email. Smart Account & gasless transactions included." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { connect } = useChain();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"idle" | "creating" | "success">("idle");

  function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setPhase("creating");
    setTimeout(() => {
      setPhase("success");
      toast.success("Smart Account created", { description: "Gasless transactions enabled." });
      setTimeout(() => navigate({ to: "/dashboard" }), 1200);
    }, 1600);
  }

  function handleWallet(id: any, label: string) {
    connect(id);
    toast.success(`${label} connected`);
    setTimeout(() => navigate({ to: "/dashboard" }), 600);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute -bottom-40 right-1/3 h-[500px] w-[700px] rounded-full bg-[radial-gradient(closest-side,var(--chain),transparent)] opacity-30 blur-3xl" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl gap-10 px-6 py-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="relative h-9 w-9 rounded-lg bg-[linear-gradient(135deg,var(--prophet),var(--chain))] chain-glow">
              <div className="absolute inset-0 grid place-items-center text-sm font-black text-primary-foreground">Ψ</div>
            </div>
            <span className="text-sm font-bold">ProphetSol</span>
          </Link>
          <h1 className="mt-10 text-4xl font-bold leading-tight md:text-5xl">
            The Gatekeeper to the <span className="text-gradient-chain">Prophet Era</span>.
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground md:text-base">
            Bring any wallet — or sign in with email and we'll auto-provision a Smart Account with gasless transactions on your behalf.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              { i: ShieldCheck, t: "Account Abstraction — Smart Account ready" },
              { i: Zap, t: "Gasless on Solana, BNB, Base, Ethereum" },
              { i: Sparkles, t: "DeAI signals unlocked from the first session" },
            ].map((f, i) => {
              const I = f.i;
              return (
                <li key={i} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--chain)]/15 text-[color:var(--chain)]">
                    <I className="h-4 w-4" />
                  </span>
                  <span className="text-muted-foreground">{f.t}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="glass-strong rounded-3xl p-6 md:p-8">
          <div className="mb-6 flex rounded-full border border-border bg-surface-1/60 p-1 text-xs">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-full px-4 py-2 capitalize transition-all ${
                  mode === m ? "bg-[color:var(--chain)]/15 text-[color:var(--chain)]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          {phase === "success" ? (
            <div className="py-10 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[color:var(--success)]/20 text-[color:var(--success)] chain-glow">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div className="mt-4 text-lg font-semibold">Smart Account ready</div>
              <p className="mt-1 text-sm text-muted-foreground">Routing you to your command center…</p>
            </div>
          ) : phase === "creating" ? (
            <div className="py-10 text-center">
              <div className="mx-auto h-14 w-14 animate-spin rounded-full border-2 border-[color:var(--chain)] border-t-transparent" />
              <div className="mt-4 text-sm font-medium">Provisioning Smart Account…</div>
              <p className="mt-1 text-xs text-muted-foreground">Enabling gasless transactions</p>
            </div>
          ) : (
            <>
              <form onSubmit={handleEmail} className="space-y-3">
                <label className="block text-xs uppercase tracking-widest text-muted-foreground">
                  {mode === "login" ? "Sign in with email" : "Create account with email"}
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@prophet.sol"
                    className="h-12 w-full rounded-xl border border-border bg-surface-1/60 pl-10 pr-3 text-sm outline-none focus:border-[color:var(--chain)] focus:chain-glow"
                  />
                </div>
                <button
                  type="submit"
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background transition-transform hover:scale-[1.01]"
                >
                  Continue with email
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <p className="text-[11px] text-muted-foreground">
                  We'll auto-create a Smart Account with gasless transactions.
                </p>
              </form>

              <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                <div className="h-px flex-1 bg-border" /> or connect wallet <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {WALLETS.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleWallet(w.id, w.label)}
                    className="group flex items-center justify-between rounded-xl border border-border bg-surface-1/60 p-3 text-left text-sm transition-all hover:border-[color:var(--chain)]/40 hover:chain-glow"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--chain)]/15 text-[color:var(--chain)]">
                        <WalletIcon className="h-4 w-4" />
                      </span>
                      {w.label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}