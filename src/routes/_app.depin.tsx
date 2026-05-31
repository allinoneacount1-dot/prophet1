import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SectionTitle } from "@/components/app/SectionTitle";
import { StatCard } from "@/components/app/StatCard";
import { Spark } from "@/components/app/Spark";
import { Network, Server, Wifi, Cpu, DollarSign, MapPin, Zap, TrendingUp, Clock } from "lucide-react";
import { useLivePrice, fmt, fmtUsd } from "@/lib/mock";

export const Route = createFileRoute("/_app/depin")({
  head: () => ({ meta: [{ title: "DePIN — Prophet" }] }),
  component: DePIN,
});

// ─── DePIN Network Data ────────────────────────────────────────────
const NETWORKS = [
  { name: "Helium", token: "HNT", icon: "📡", color: "#47C747", apy: 12.5, nodes: 980000 },
  { name: "Render", token: "RNDR", icon: "🎨", color: "#A64AFF", apy: 18.2, nodes: 42000 },
  { name: "Filecoin", token: "FIL", icon: "💾", color: "#0090FF", apy: 9.8, nodes: 3800 },
  { name: "Arweave", token: "AR", icon: "🕸️", color: "#222222", apy: 11.4, nodes: 1200 },
  { name: "Hivemapper", token: "HONEY", icon: "🗺️", color: "#FFB800", apy: 22.1, nodes: 480000 },
  { name: "DIMO", token: "DIMO", icon: "🚗", color: "#00D4AA", apy: 15.7, nodes: 210000 },
];

// Global node locations (simplified world map)
const NODE_LOCATIONS = [
  { lat: 40.7, lng: -74.0, city: "New York", nodes: 12400 },
  { lat: 51.5, lng: -0.1, city: "London", nodes: 9800 },
  { lat: 35.7, lng: 139.7, city: "Tokyo", nodes: 15200 },
  { lat: 37.8, lng: -122.4, city: "San Francisco", nodes: 8900 },
  { lat: 52.5, lng: 13.4, city: "Berlin", nodes: 7600 },
  { lat: 1.3, lng: 103.8, city: "Singapore", nodes: 6800 },
  { lat: -33.9, lng: 151.2, city: "Sydney", nodes: 5400 },
  { lat: 19.4, lng: -99.1, city: "Mexico City", nodes: 4200 },
  { lat: 13.8, lng: 100.5, city: "Bangkok", nodes: 3800 },
  { lat: -23.5, lng: -46.6, city: "São Paulo", nodes: 5100 },
  { lat: 28.6, lng: 77.2, city: "Delhi", nodes: 4600 },
  { lat: 55.8, lng: 37.6, city: "Moscow", nodes: 3200 },
  { lat: -26.2, lng: 28.0, city: "Johannesburg", nodes: 1800 },
  { lat: 25.2, lng: 55.3, city: "Dubai", nodes: 2900 },
  { lat: 31.2, lng: 121.5, city: "Shanghai", nodes: 11200 },
  { lat: 39.9, lng: 116.4, city: "Beijing", nodes: 9800 },
  { lat: 48.9, lng: 2.3, city: "Paris", nodes: 6700 },
  { lat: 34.1, lng: -118.2, city: "Los Angeles", nodes: 7800 },
];

// DePIN hardware options
const HARDWARE = [
  { name: "Helium Hotspot", cost: 499, network: "Helium", monthlyEarning: 45, img: "📡" },
  { name: "Render Node (RTX 4090)", cost: 3500, network: "Render", monthlyEarning: 280, img: "🎮" },
  { name: "Filecoin Storage (1TB)", cost: 299, network: "Filecoin", monthlyEarning: 35, img: "💾" },
  { name: "Arweave Miner", cost: 1200, network: "Arweave", monthlyEarning: 95, img: "🕸️" },
  { name: "Hivemapper Dashcam", cost: 349, network: "Hivemapper", monthlyEarning: 55, img: "📹" },
  { name: "DIMO Auto Connect", cost: 199, network: "DIMO", monthlyEarning: 30, img: "🚗" },
];

function DePIN() {
  const solPrice = useLivePrice(150, 0.004);
  const [selectedNetwork, setSelectedNetwork] = useState(0);
  const [hardwareIdx, setHardwareIdx] = useState(0);
  const [runHours, setRunHours] = useState(24);
  const [electricityCost, setElectricityCost] = useState(0.12); // $/kWh

  const network = NETWORKS[selectedNetwork];
  const hardware = HARDWARE[hardwareIdx];

  // ROI calculation
  const roi = useMemo(() => {
    const powerWatts = hardware.network === "Render" ? 450 : hardware.network === "Filecoin" ? 150 : 50;
    const dailyKWh = (powerWatts * runHours) / 1000;
    const dailyElecCost = dailyKWh * electricityCost;
    const dailyEarning = hardware.monthlyEarning / 30;
    const dailyProfit = dailyEarning - dailyElecCost;
    const monthlyProfit = dailyProfit * 30;
    const yearlyProfit = dailyProfit * 365;
    const roiMonths = monthlyProfit > 0 ? hardware.cost / monthlyProfit : Infinity;
    const roiPercent = yearlyProfit > 0 ? (yearlyProfit / hardware.cost) * 100 : 0;

    return {
      dailyEarning,
      dailyElecCost,
      dailyProfit,
      monthlyProfit,
      yearlyProfit,
      roiMonths,
      roiPercent,
      powerWatts,
      dailyKWh,
    };
  }, [hardware, runHours, electricityCost]);

  const totalNodes = NETWORKS.reduce((s, n) => s + n.nodes, 0);

  return (
    <>
      <PageHeader
        eyebrow="Infrastructure"
        title="DePIN · Decentralized Networks"
        description="Deploy nodes, earn passive income, and power the decentralized physical infrastructure revolution."
      />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Global Nodes"
          value={fmt(totalNodes, 0)}
          delta={{ value: "Live", positive: true }}
          icon={<Network className="h-4 w-4" />}
        />
        <StatCard
          label="Networks"
          value={`${NETWORKS.length}`}
          delta={{ value: "Active", positive: true }}
          icon={<Server className="h-4 w-4" />}
        />
        <StatCard
          label="Best APY"
          value={`${Math.max(...NETWORKS.map((n) => n.apy)).toFixed(1)}%`}
          delta={{ value: NETWORKS[NETWORKS.findIndex((n) => n.apy === Math.max(...NETWORKS.map((nn) => nn.apy)))].name, positive: true }}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Your Nodes"
          value="0"
          delta={{ value: "Deploy to start", positive: true }}
          icon={<Wifi className="h-4 w-4" />}
        />
      </div>

      {/* Network Selector + Map */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-3">
          <SectionTitle title="Networks" hint="Select a network" />
          {NETWORKS.map((n, i) => (
            <button
              key={n.name}
              onClick={() => setSelectedNetwork(i)}
              className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                selectedNetwork === i
                  ? "border-[color:var(--chain)] bg-[color:var(--chain)]/5"
                  : "border-border bg-surface-1/40 hover:border-[color:var(--chain)]/30"
              }`}
            >
              <span className="text-xl">{n.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{n.name}</div>
                <div className="text-[10px] text-muted-foreground">{n.nodes.toLocaleString()} nodes</div>
              </div>
              <span className="text-xs font-bold" style={{ color: n.color }}>{n.apy}%</span>
            </button>
          ))}
        </div>

        {/* Interactive Map */}
        <GlassCard className="lg:col-span-2">
          <SectionTitle
            icon={<MapPin className="h-4 w-4" />}
            title={`${network.name} Node Map`}
            hint={`${network.nodes.toLocaleString()} nodes worldwide`}
          />
          {/* Simplified world map visualization */}
          <div className="relative h-64 rounded-xl bg-surface-2/50 overflow-hidden">
            {/* Grid lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              {[...Array(8)].map((_, i) => (
                <line key={`h${i}`} x1="0" y1={`${(i + 1) * 12.5}%`} x2="100%" y2={`${(i + 1) * 12.5}%`} stroke="currentColor" strokeWidth="0.5" />
              ))}
              {[...Array(12)].map((_, i) => (
                <line key={`v${i}`} x1={`${(i + 1) * 8.33}%`} y1="0" x2={`${(i + 1) * 8.33}%`} y2="100%" stroke="currentColor" strokeWidth="0.5" />
              ))}
            </svg>

            {/* Node dots */}
            {NODE_LOCATIONS.map((loc, i) => {
              // Convert lat/lng to percentage position
              const x = ((loc.lng + 180) / 360) * 100;
              const y = ((90 - loc.lat) / 180) * 100;
              const opacity = Math.min(0.3 + (loc.nodes / 15200) * 0.7, 1);
              const size = Math.max(4, Math.min(12, (loc.nodes / 15200) * 12));

              return (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: size,
                    height: size,
                    background: network.color,
                    opacity,
                    transform: "translate(-50%, -50%)",
                    boxShadow: `0 0 ${size}px ${network.color}`,
                  }}
                  title={`${loc.city}: ${loc.nodes.toLocaleString()} nodes`}
                />
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-2 left-2 flex items-center gap-2 text-[9px] text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: network.color, opacity: 0.4 }} />
              <span>Low</span>
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: network.color, opacity: 0.7 }} />
              <span>Medium</span>
              <span className="inline-block h-4 w-4 rounded-full" style={{ background: network.color, opacity: 1 }} />
              <span>High</span>
            </div>
            <div className="absolute bottom-2 right-2 text-[9px] text-muted-foreground">
              Total: {network.nodes.toLocaleString()} nodes
            </div>
          </div>

          {/* Top regions */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[...NODE_LOCATIONS].sort((a, b) => b.nodes - a.nodes).slice(0, 6).map((loc, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface-1/40 p-2 text-center">
                <div className="text-[10px] text-muted-foreground">{loc.city}</div>
                <div className="text-xs font-semibold">{fmt(loc.nodes, 0)}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ROI Calculator */}
      <div className="mt-8">
        <SectionTitle
          icon={<DollarSign className="h-4 w-4" />}
          title="ROI Calculator"
          hint="Estimate your DePIN earnings"
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Hardware selector */}
          <GlassCard>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Hardware</div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {HARDWARE.map((h, i) => (
                <button
                  key={h.name}
                  onClick={() => setHardwareIdx(i)}
                  className={`rounded-lg border p-2 text-left text-xs transition-all ${
                    hardwareIdx === i
                      ? "border-[color:var(--chain)] bg-[color:var(--chain)]/5"
                      : "border-border bg-surface-1/40 hover:border-[color:var(--chain)]/20"
                  }`}
                >
                  <span className="text-lg">{h.img}</span>
                  <div className="font-medium mt-1 line-clamp-1">{h.name}</div>
                  <div className="text-[10px] text-muted-foreground">${h.cost}</div>
                </button>
              ))}
            </div>

            {/* Settings */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Run hours per day: {runHours}h</label>
                <input
                  type="range"
                  min={1}
                  max={24}
                  value={runHours}
                  onChange={(e) => setRunHours(+e.target.value)}
                  className="w-full accent-[color:var(--chain)] mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Electricity cost ($/kWh)</label>
                <input
                  type="number"
                  step={0.01}
                  min={0.01}
                  max={1}
                  value={electricityCost}
                  onChange={(e) => setElectricityCost(+e.target.value)}
                  className="h-8 w-full rounded-lg border border-border bg-surface-1/60 px-2 text-sm outline-none focus:border-[color:var(--chain)]"
                />
              </div>
            </div>
          </GlassCard>

          {/* Results */}
          <GlassCard glow>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Estimated Earnings</div>

            <div className="space-y-4">
              {/* Daily */}
              <div className="rounded-xl border border-border p-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Daily</span>
                  <span>{roi.powerWatts}W · {roi.dailyKWh.toFixed(2)} kWh · ${roi.dailyElecCost.toFixed(2)} elec</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[color:var(--chain)]">
                    ${roi.dailyProfit.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">net profit</span>
                </div>
              </div>

              {/* Monthly / Yearly */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border p-3 text-center">
                  <div className="text-xs text-muted-foreground">Monthly</div>
                  <div className="text-xl font-bold text-[color:var(--chain)]">${roi.monthlyProfit.toFixed(0)}</div>
                </div>
                <div className="rounded-xl border border-border p-3 text-center">
                  <div className="text-xs text-muted-foreground">Yearly</div>
                  <div className="text-xl font-bold text-[color:var(--chain)]">${roi.yearlyProfit.toFixed(0)}</div>
                </div>
              </div>

              {/* ROI */}
              <div className="rounded-xl border border-border p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-semibold">Break-even</div>
                    <div className="text-xs text-muted-foreground">Hardware cost: ${hardware.cost}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[color:var(--chain)]">
                      {roi.roiMonths === Infinity ? "—" : `${roi.roiMonths.toFixed(1)} months`}
                    </div>
                    <div className="text-xs text-muted-foreground">{roi.roiPercent.toFixed(0)}% annual ROI</div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--prophet),var(--chain))] transition-all"
                    style={{ width: `${Math.min(100, roi.roiPercent)}%` }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Deploy CTA */}
      <div className="mt-8">
        <GlassCard glow>
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--chain)]/15 text-2xl">
              {network.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Deploy a {network.name} Node</div>
              <div className="text-xs text-muted-foreground">
                Join {network.nodes.toLocaleString()} nodes earning {network.apy}% APY. Hardware starting at ${hardware.cost}.
              </div>
            </div>
            <button
              onClick={() => toast.info(`${network.name} deployment`, { description: "Redirecting to official deployment guide..." })}
              className="h-10 rounded-lg bg-[linear-gradient(135deg,var(--prophet),var(--chain))] px-4 text-xs font-semibold text-primary-foreground"
            >
              Deploy Now
            </button>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
