// ─── Lazy Chart Wrapper ─────────────────────────────────────────────
// Dynamically imports recharts only when analytics/charts pages are visited
// Saves ~150KB from initial bundle

import { Suspense, lazy, ComponentType } from "react";

const ChartComponents: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
  LineChart: () => import("recharts").then((m) => ({ default: (props: any) => {
    const { LineChart: C, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = m;
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={props.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
          <Line type="monotone" dataKey="value" stroke="#14F195" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  }})),
};

export function LazyChart({ type, ...props }: { type: keyof typeof ChartComponents; [k: string]: any }) {
  const Loader = lazy(ChartComponents[type]);
  return (
    <Suspense fallback={<div className="h-[300px] animate-pulse rounded-xl bg-white/5" />}>
      <Loader {...props} />
    </Suspense>
  );
}
