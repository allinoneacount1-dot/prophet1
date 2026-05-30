import { useMemo } from "react";
import { useTicker } from "@/lib/mock";

export function Spark({
  color = "var(--chain)",
  height = 48,
  seed = 1,
  live = true,
}: {
  color?: string;
  height?: number;
  seed?: number;
  live?: boolean;
}) {
  const tick = useTicker(live ? 1500 : 999999);
  const points = useMemo(() => {
    const n = 32;
    const arr: number[] = [];
    let v = 50 + (seed % 30);
    for (let i = 0; i < n; i++) {
      v += (Math.sin((i + tick) * 0.6 + seed) + (Math.random() - 0.5)) * 4;
      arr.push(v);
    }
    return arr;
  }, [tick, seed]);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 100 - ((p - min) / (max - min || 1)) * 100;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height }}>
      <defs>
        <linearGradient id={`g-${seed}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L100,100 L0,100 Z`} fill={`url(#g-${seed})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}