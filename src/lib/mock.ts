import { useEffect, useState } from "react";

export function useTicker(intervalMs = 1500) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return tick;
}

export function useLivePrice(base: number, volatility = 0.004, intervalMs = 1200) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setV((prev) => Math.max(0.0001, prev * (1 + (Math.random() - 0.5) * volatility * 2)));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, volatility]);
  return v;
}

export function fmt(n: number, digits = 2) {
  if (n >= 1e9) return (n / 1e9).toFixed(digits) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(digits) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(digits) + "K";
  return n.toFixed(digits);
}

export function fmtUsd(n: number) {
  return "$" + fmt(n, 2);
}

export function makeSeries(len = 40, start = 100, vol = 0.04) {
  const out: { x: number; y: number }[] = [];
  let v = start;
  for (let i = 0; i < len; i++) {
    v = v * (1 + (Math.random() - 0.48) * vol);
    out.push({ x: i, y: Math.max(1, v) });
  }
  return out;
}

export const ACTIVITY_VERBS = [
  "staked",
  "swapped",
  "claimed",
  "shared alpha on",
  "voted on",
  "minted",
  "bridged",
  "burned",
];

export const TOKENS = ["$PROPHET", "SOL", "BNB", "ETH", "USDC", "JUP", "WIF", "PEPE", "BONK"];

export function randomActivity(seed: number) {
  const r = (n: number) => Math.floor((((seed * 9301 + n * 49297) % 233280) / 233280) * 1000);
  const verb = ACTIVITY_VERBS[r(1) % ACTIVITY_VERBS.length];
  const token = TOKENS[r(2) % TOKENS.length];
  const amount = (1 + (r(3) % 9999) / 100).toFixed(2);
  const wallet = "0x" + (seed * 7).toString(16).padStart(6, "0").slice(0, 6);
  return { verb, token, amount, wallet };
}
