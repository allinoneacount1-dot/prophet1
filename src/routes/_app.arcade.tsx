import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { Gamepad2, Trophy, Zap, Timer, Target, TrendingUp, TrendingDown, Flame, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNativeWallet, shortAddr } from "@/lib/use-native-wallet";
import { useTokenPrice } from "@/lib/useOnchain";

export const Route = createFileRoute("/_app.arcade")({
  head: () => ({ meta: [{ title: "Arcade — Prophet" }] }),
  component: Arcade,
});

// ─── Game 1: Predict & Earn ────────────────────────────────────────
// Guess if SOL price goes up or down in 30 seconds
function PredictGame() {
  const { data: initialPrice } = useTokenPrice("SOL");
  const [price, setPrice] = useState<number>(initialPrice || 150);
  const [startPrice, setStartPrice] = useState<number>(0);
  const [guess, setGuess] = useState<"up" | "down" | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGame = (direction: "up" | "down") => {
    if (!initialPrice) return;
    setGuess(direction);
    setStartPrice(initialPrice);
    setPrice(initialPrice);
    setCountdown(30);
    setResult(null);

    // Simulate price movement (random walk with slight upward bias)
    let currentPrice = initialPrice;
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });

      // Random walk: -0.5% to +0.5% per tick
      const change = 1 + (Math.random() - 0.48) * 0.01;
      currentPrice *= change;
      setPrice(currentPrice);
    }, 1000);
  };

  // When countdown hits 0, determine result
  useEffect(() => {
    if (countdown === 0 && guess !== null && startPrice > 0) {
      const wentUp = price >= startPrice;
      const won = (guess === "up" && wentUp) || (guess === "down" && !wentUp);
      setResult(won ? "win" : "lose");
      setTotalGames((p) => p + 1);
      if (won) {
        setStreak((p) => p + 1);
        setTotalWins((p) => p + 1);
      } else {
        setStreak(0);
      }
      setGuess(null);
    }
  }, [countdown, guess, startPrice, price]);

  const score = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

  return (
    <GlassCard glow>
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-[color:var(--chain)]" />
        <div className="text-sm font-semibold">Predict & Earn</div>
        <span className="ml-auto text-[10px] text-muted-foreground">Guess SOL direction</span>
      </div>

      {/* Price display */}
      <div className="text-center py-6">
        <div className="text-xs text-muted-foreground mb-1">SOL Price</div>
        <div className="text-4xl font-bold tabular-nums text-[color:var(--chain)]">
          ${price.toFixed(2)}
        </div>
        {startPrice > 0 && countdown > 0 && (
          <div className={`mt-2 text-sm font-medium ${price >= startPrice ? "text-[color:var(--success)]" : "text-red-400"}`}>
            {price >= startPrice ? "▲" : "▼"} {((price - startPrice) / startPrice * 100).toFixed(2)}%
          </div>
        )}
      </div>

      {/* Countdown */}
      {countdown > 0 && (
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-1.5 text-sm text-yellow-400">
            <Timer className="h-4 w-4" />
            {countdown}s remaining
          </div>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`text-center py-3 rounded-xl mb-4 ${result === "win" ? "bg-[color:var(--success)]/10 text-[color:var(--success)]" : "bg-red-500/10 text-red-400"}`}
          >
            <div className="text-2xl mb-1">{result === "win" ? "🎉" : "😅"}</div>
            <div className="font-bold">{result === "win" ? "Correct!" : "Wrong!"}</div>
            <div className="text-xs mt-1">
              SOL went {price >= startPrice ? "up" : "down"} by {Math.abs(((price - startPrice) / startPrice * 100)).toFixed(2)}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      {countdown === 0 && !guess && (
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => startGame("up")}
            disabled={!initialPrice}
            className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl bg-[color:var(--success)]/10 border border-[color:var(--success)]/30 text-[color:var(--success)] font-semibold hover:bg-[color:var(--success)]/20 disabled:opacity-50"
          >
            <TrendingUp className="h-5 w-5" /> UP 📈
          </button>
          <button
            onClick={() => startGame("down")}
            disabled={!initialPrice}
            className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/20 disabled:opacity-50"
          >
            <TrendingDown className="h-5 w-5" /> DOWN 📉
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg border border-border p-2">
          <div className="text-muted-foreground">Streak</div>
          <div className="font-bold text-[color:var(--chain)] flex items-center justify-center gap-1">
            <Flame className="h-3 w-3" /> {streak}
          </div>
        </div>
        <div className="rounded-lg border border-border p-2">
          <div className="text-muted-foreground">Win Rate</div>
          <div className="font-bold">{score}%</div>
        </div>
        <div className="rounded-lg border border-border p-2">
          <div className="text-muted-foreground">Played</div>
          <div className="font-bold">{totalGames}</div>
        </div>
      </div>
    </GlassCard>
  );
}

// ─── Game 2: Tap-to-Earn ───────────────────────────────────────────
// Click as fast as you can in 10 seconds
function TapGame() {
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    try { return parseInt(localStorage.getItem("arcade_tap_best") || "0"); } catch { return 0; }
  });
  const [multiplier, setMultiplier] = useState(1);
  const [lastTapTime, setLastTapTime] = useState(0);

  const startGame = () => {
    setTaps(0);
    setTimeLeft(10);
    setPlaying(true);
    setFinished(false);
    setMultiplier(1);
    setLastTapTime(Date.now());
  };

  const handleTap = useCallback(() => {
    if (!playing) return;

    const now = Date.now();
    const timeDiff = now - lastTapTime;

    // Speed multiplier: faster taps = higher multiplier
    let newMultiplier = 1;
    if (timeDiff < 100) newMultiplier = 5;
    else if (timeDiff < 200) newMultiplier = 3;
    else if (timeDiff < 400) newMultiplier = 2;

    setMultiplier(newMultiplier);
    setLastTapTime(now);
    setTaps((p) => p + newMultiplier);
  }, [playing, lastTapTime]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timer);
          setPlaying(false);
          setFinished(true);
          return 0;
        }
        return Math.round((prev - 0.1) * 10) / 10;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    if (finished && taps > bestScore) {
      setBestScore(taps);
      try { localStorage.setItem("arcade_tap_best", String(taps)); } catch {}
    }
  }, [finished, taps, bestScore]);

  const tapsPerSecond = timeLeft < 10 ? (taps / (10 - timeLeft)).toFixed(1) : "0.0";
  const score = taps;

  return (
    <GlassCard glow>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-yellow-400" />
        <div className="text-sm font-semibold">Tap-to-Earn</div>
        <span className="ml-auto text-[10px] text-muted-foreground">Speed = multiplier</span>
      </div>

      {/* Score display */}
      <div className="text-center py-8">
        <div className="text-xs text-muted-foreground mb-1">Score</div>
        <div className="text-5xl font-bold tabular-nums text-[color:var(--chain)]">
          {score}
        </div>
        {multiplier > 1 && playing && (
          <motion.div
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-2 text-sm font-bold text-yellow-400"
          >
            x{multiplier} COMBO!
          </motion.div>
        )}
      </div>

      {/* Timer */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium" style={{
          background: timeLeft <= 3 ? "rgba(239,68,68,0.1)" : "rgba(234,179,8,0.1)",
          color: timeLeft <= 3 ? "#ef4444" : "#eab308",
        }}>
          <Timer className="h-4 w-4" />
          {timeLeft.toFixed(1)}s
        </div>
      </div>

      {/* Tap button */}
      {!playing && !finished && (
        <button
          onClick={startGame}
          className="w-full h-20 rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] font-bold text-primary-foreground text-lg"
        >
          {taps > 0 ? "Play Again" : "Start Tapping!"}
        </button>
      )}
      {playing && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleTap}
          className="w-full h-24 rounded-xl bg-[linear-gradient(135deg,#f59e0b,#ef4444)] font-bold text-white text-2xl active:brightness-110 select-none"
        >
          TAP! 👆
        </motion.button>
      )}
      {finished && (
        <div className="space-y-3">
          <div className="text-center py-3 rounded-xl bg-[color:var(--chain)]/10">
            <div className="text-xs text-muted-foreground">Final Score</div>
            <div className="text-2xl font-bold text-[color:var(--chain)]">{score}</div>
            <div className="text-xs text-muted-foreground">{tapsPerSecond} taps/sec</div>
          </div>
          <button
            onClick={startGame}
            className="w-full h-14 rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] font-bold text-primary-foreground"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
        <div className="rounded-lg border border-border p-2">
          <div className="text-muted-foreground">Best</div>
          <div className="font-bold text-yellow-400 flex items-center justify-center gap-1">
            <Star className="h-3 w-3" /> {bestScore}
          </div>
        </div>
        <div className="rounded-lg border border-border p-2">
          <div className="text-muted-foreground">Speed</div>
          <div className="font-bold">{tapsPerSecond}/s</div>
        </div>
        <div className="rounded-lg border border-border p-2">
          <div className="text-muted-foreground">Max Combo</div>
          <div className="font-bold text-yellow-400">x{multiplier}</div>
        </div>
      </div>
    </GlassCard>
  );
}

// ─── Game 3: Memory Card ───────────────────────────────────────────
// Classic card matching game
function MemoryGame() {
  const EMOJI = ["🔮", "⚡", "🌟", "💎", "🔥", "🪐", "🎯", "💰"];
  const [cards, setCards] = useState<Array<{ id: number; emoji: string; flipped: boolean; matched: boolean }>>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);

  const initGame = () => {
    const shuffled = [...EMOJI, ...EMOJI]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    setCards(shuffled);
    setSelected([]);
    setMoves(0);
    setMatches(0);
    setStarted(true);
    setComplete(false);
  };

  const handleCardClick = (id: number) => {
    if (selected.length >= 2) return;
    const card = cards[id];
    if (card.flipped || card.matched) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((p) => p + 1);
      const [first, second] = newSelected;
      if (cards[first].emoji === cards[second].emoji) {
        // Match
        const matched = [...newCards];
        matched[first].matched = true;
        matched[second].matched = true;
        setCards(matched);
        setMatches((p) => p + 1);
        setSelected([]);
        if (matches + 1 === EMOJI.length) {
          setComplete(true);
        }
      } else {
        // No match — flip back after delay
        setTimeout(() => {
          const reset = [...newCards];
          reset[first].flipped = false;
          reset[second].flipped = false;
          setCards(reset);
          setSelected([]);
        }, 800);
      }
    }
  };

  return (
    <GlassCard glow>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🧠</span>
        <div className="text-sm font-semibold">Memory Match</div>
        <span className="ml-auto text-[10px] text-muted-foreground">Find all pairs</span>
      </div>

      {!started ? (
        <button
          onClick={initGame}
          className="w-full h-20 rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] font-bold text-primary-foreground"
        >
          Start Game
        </button>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {cards.map((card) => (
              <motion.button
                key={card.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-lg text-2xl font-bold flex items-center justify-center transition-all ${
                  card.matched
                    ? "bg-[color:var(--chain)]/20 border border-[color:var(--chain)]/40"
                    : card.flipped
                    ? "bg-surface-2 border border-border"
                    : "bg-surface-1 border border-border hover:border-[color:var(--chain)]/30"
                }`}
              >
                {(card.flipped || card.matched) ? card.emoji : "?"}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg border border-border p-2">
              <div className="text-muted-foreground">Moves</div>
              <div className="font-bold">{moves}</div>
            </div>
            <div className="rounded-lg border border-border p-2">
              <div className="text-muted-foreground">Matches</div>
              <div className="font-bold text-[color:var(--chain)]">{matches}/{EMOJI.length}</div>
            </div>
            <div className="rounded-lg border border-border p-2">
              <div className="text-muted-remaining">Left</div>
              <div className="font-bold">{EMOJI.length - matches}</div>
            </div>
          </div>

          {complete && (
            <div className="mt-4 text-center py-4 rounded-xl bg-[color:var(--success)]/10">
              <div className="text-2xl mb-1">🎉</div>
              <div className="font-bold text-[color:var(--success)]">Completed in {moves} moves!</div>
              <button onClick={initGame} className="mt-2 text-xs text-[color:var(--chain)] hover:underline">
                Play Again
              </button>
            </div>
          )}
        </>
      )}
    </GlassCard>
  );
}

// ─── Main Arcade Page ──────────────────────────────────────────────
function Arcade() {
  return (
    <>
      <PageHeader
        eyebrow="GameFi"
        title="Arcade"
        description="Play mini-games, compete on leaderboards, and earn XP. More games coming soon."
      />

      {/* Leaderboard teaser */}
      <GlassCard className="mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-400" />
          <div>
            <div className="text-sm font-semibold">Season 1 Leaderboard</div>
            <div className="text-xs text-muted-foreground">Compete for the top spot. Rewards distributed weekly.</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs text-muted-foreground">Your Rank</div>
            <div className="text-lg font-bold text-[color:var(--chain)]">--</div>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <PredictGame />
        <TapGame />
      </div>

      <div className="mt-4">
        <MemoryGame />
      </div>

      {/* Coming soon */}
      <div className="mt-8">
        <GlassCard className="py-8 text-center border-dashed border-2">
          <Gamepad2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground opacity-50" />
          <div className="text-sm text-muted-foreground">More games coming soon</div>
          <div className="mt-1 text-xs text-muted-foreground">Whale Hunt · Oracle Tower · Vault Crash · Dice Roll</div>
        </GlassCard>
      </div>
    </>
  );
}
