import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { Gamepad2, Trophy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/arcade")({
  head: () => ({ meta: [{ title: "Arcade — ProphetSol" }] }),
  component: Arcade,
});

const GAMES = [
  { name: "Run Prophet Run", desc: "Endless runner. Burn calories, earn $PROPHET.", color: "var(--chain)" },
  { name: "Oracle Tower", desc: "Tower-defense with on-chain leaderboards.", color: "var(--chain-2)" },
  { name: "Whale Hunt", desc: "Predict whale moves to win bonus drops.", color: "oklch(0.78 0.18 60)" },
  { name: "Vault Crash", desc: "Crash-style game with provably-fair RNG.", color: "oklch(0.7 0.22 25)" },
];

function Arcade() {
  return (
    <>
      <PageHeader eyebrow="ProphetSol Arcade" title="GameFi Hub" description="Mini-games powered by $PROPHET. Monthly leaderboard rewards for top players." />

      <div className="grid gap-4 md:grid-cols-2">
        {GAMES.map((g) => (
          <GlassCard key={g.name} glow>
            <div className="relative h-40 overflow-hidden rounded-xl border border-border bg-[radial-gradient(ellipse_at_top,var(--chain)/0.25,transparent_60%)] grid-bg">
              <div className="absolute inset-0 grid place-items-center">
                <Gamepad2 className="h-16 w-16 text-[color:var(--chain)] animate-float" />
              </div>
            </div>
            <div className="mt-4 flex items-start justify-between">
              <div>
                <div className="text-base font-semibold">{g.name}</div>
                <div className="text-xs text-muted-foreground">{g.desc}</div>
              </div>
              <button onClick={() => toast.success(`Launching ${g.name}…`)} className="rounded-lg bg-[linear-gradient(135deg,var(--prophet),var(--chain))] px-3 py-1.5 text-xs font-semibold text-primary-foreground">Play</button>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-8">
        <SectionTitle icon={<Trophy className="h-4 w-4" />} title="Global Leaderboard" hint="This month · 250,000 $PROPHET prize pool" />
        <GlassCard>
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-widest text-muted-foreground"><tr><th className="py-2">#</th><th>Player</th><th>Game</th><th>Score</th><th>Reward</th></tr></thead>
            <tbody>
              {[
                [1, "neon.sol", "Run Prophet Run", "428,210", "50,000 $PROPHET"],
                [2, "drift.eth", "Vault Crash", "382,001", "30,000 $PROPHET"],
                [3, "oracle.bnb", "Oracle Tower", "318,440", "15,000 $PROPHET"],
                [4, "alpha.base", "Whale Hunt", "284,002", "8,000 $PROPHET"],
              ].map((r) => (
                <tr key={r[0]} className="border-t border-border">
                  <td className="py-3 font-semibold text-[color:var(--chain)]">#{r[0]}</td>
                  <td>{r[1]}</td><td className="text-muted-foreground">{r[2]}</td>
                  <td className="tabular-nums">{r[3]}</td>
                  <td className="text-[color:var(--success)]">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>
    </>
  );
}