import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { StatCard } from "@/components/app/StatCard";
import { Spark } from "@/components/app/Spark";
import { Network, Server, Wifi } from "lucide-react";
import { useLivePrice, fmt } from "@/lib/mock";

export const Route = createFileRoute("/_app/depin")({
  head: () => ({ meta: [{ title: "DePIN — ProphetSol" }] }),
  component: DePIN,
});

const NODES = [
  { x: "18%", y: "32%" }, { x: "28%", y: "28%" }, { x: "48%", y: "30%" },
  { x: "55%", y: "45%" }, { x: "68%", y: "38%" }, { x: "75%", y: "52%" },
  { x: "82%", y: "30%" }, { x: "35%", y: "60%" }, { x: "22%", y: "50%" },
  { x: "60%", y: "70%" }, { x: "78%", y: "65%" }, { x: "42%", y: "42%" },
];

function DePIN() {
  const [city, setCity] = useState("Jakarta");
  const [hours, setHours] = useState(20);
  const monthly = (hours * 30 * 0.42).toFixed(2);

  const active = useLivePrice(18420, 0.001);
  const uptime = useLivePrice(99.94, 0.0002);
  const tput = useLivePrice(842, 0.004);

  return (
    <>
      <PageHeader eyebrow="Infrastructure" title="DePIN · Decentralized Physical Network" description="Real-time map of physical infrastructure nodes powering ProphetSol's compute, storage, and data layers." />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Active Nodes" value={Math.round(active).toLocaleString()} delta={{ value: "+128", positive: true }} icon={<Server className="h-4 w-4" />} />
        <StatCard label="Network Uptime" value={`${uptime.toFixed(2)}%`} delta={{ value: "Stable", positive: true }} icon={<Wifi className="h-4 w-4" />} />
        <StatCard label="Data Throughput" value={`${fmt(tput, 0)} GB/s`} icon={<Network className="h-4 w-4" />} />
        <StatCard label="Avg Node ROI" value="184%" delta={{ value: "+4.2%", positive: true }} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <SectionTitle icon={<Network className="h-4 w-4" />} title="Global Node Map" hint="Live · 192 regions" />
          <div className="relative aspect-[2/1] overflow-hidden rounded-xl border border-border bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.18_285/0.1),transparent_60%)] grid-bg">
            {NODES.map((n, i) => (
              <span key={i} className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--chain)] chain-glow" style={{ left: n.x, top: n.y, animation: `prophet-pulse ${2 + (i % 3)}s ease-in-out infinite` }} />
            ))}
            <div className="absolute bottom-3 left-3 rounded-md bg-background/70 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur">Asia-Pacific cluster · streaming</div>
          </div>
          <div className="mt-4">
            <Spark seed={88} height={80} />
          </div>
        </GlassCard>

        <GlassCard glow>
          <SectionTitle icon={<Server className="h-4 w-4" />} title="Offline Simulator" hint="Estimate node ROI" />
          <label className="text-xs text-muted-foreground">Location</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-border bg-surface-1/60 px-3 text-sm outline-none focus:border-[color:var(--chain)]" />
          <label className="mt-3 block text-xs text-muted-foreground">Daily uptime · {hours}h</label>
          <input type="range" min={1} max={24} value={hours} onChange={(e) => setHours(+e.target.value)} className="mt-1 w-full accent-[color:var(--chain)]" />
          <div className="mt-4 rounded-xl border border-[color:var(--chain)]/30 bg-[color:var(--chain)]/10 p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Monthly est. revenue</div>
            <div className="mt-1 text-3xl font-semibold text-[color:var(--chain)]">${monthly}</div>
            <div className="text-xs text-muted-foreground">in {city}</div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-8">
        <SectionTitle icon={<Server className="h-4 w-4" />} title="Node Marketplace" hint="Available hardware kits" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Prophet Mini Node", req: "8GB RAM · 100GB SSD", rev: "$32 / mo", region: "Global" },
            { name: "Prophet Edge Node", req: "16GB RAM · 1TB NVMe", rev: "$108 / mo", region: "EU · US" },
            { name: "Prophet Vault Node", req: "32GB RAM · 4TB · GPU", rev: "$340 / mo", region: "Limited" },
          ].map((n) => (
            <GlassCard key={n.name} glow>
              <div className="text-sm font-semibold">{n.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">{n.req}</div>
              <div className="mt-3 flex items-baseline justify-between">
                <div className="text-2xl font-semibold text-[color:var(--chain)]">{n.rev}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{n.region}</div>
              </div>
              <button className="mt-3 h-10 w-full rounded-lg border border-[color:var(--chain)]/40 bg-[color:var(--chain)]/10 text-xs text-[color:var(--chain)]">Deploy</button>
            </GlassCard>
          ))}
        </div>
      </div>
    </>
  );
}