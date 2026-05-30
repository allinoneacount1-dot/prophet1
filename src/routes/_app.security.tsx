import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { StatCard } from "@/components/app/StatCard";
import { ShieldCheck, AlertTriangle, Eye, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_app/security")({
  head: () => ({ meta: [{ title: "Security Center — Prophet" }] }),
  component: Security,
});

function Security() {
  const [addr, setAddr] = useState("");
  return (
    <>
      <PageHeader
        eyebrow="Security"
        title="Security Center"
        description="Institutional-grade protection. Monitor wallet risk, detect phishing, scan contracts, and simulate transactions."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Wallet Risk"
          value="Low"
          delta={{ value: "Healthy", positive: true }}
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <StatCard
          label="Phishing Blocked"
          value="124"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <StatCard label="Contracts Scanned" value="42" icon={<ScanLine className="h-4 w-4" />} />
        <StatCard label="Monitors" value="8 active" icon={<Eye className="h-4 w-4" />} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <GlassCard glow>
          <div className="mb-3 text-sm font-semibold flex items-center gap-2">
            <ScanLine className="h-4 w-4 text-[color:var(--chain)]" /> Contract Scanner
          </div>
          <input
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            placeholder="Paste contract address…"
            className="h-10 w-full rounded-lg border border-border bg-surface-1/60 px-3 text-sm outline-none focus:border-[color:var(--chain)]"
          />
          <button
            onClick={() =>
              toast.success("Contract scanned", { description: "Risk 14/100 · 0 critical issues." })
            }
            className="mt-3 h-10 w-full rounded-lg bg-[linear-gradient(135deg,var(--prophet),var(--chain))] text-sm font-semibold text-primary-foreground"
          >
            Scan
          </button>
          <ul className="mt-4 space-y-2 text-xs">
            {[
              ["Honeypot detection", "Pass"],
              ["Owner functions", "Renounced"],
              ["Mint permissions", "Locked"],
              ["Liquidity", "Verified"],
            ].map(([k, v]) => (
              <li
                key={k}
                className="flex items-center justify-between rounded-lg border border-border bg-surface-1/40 p-2"
              >
                <span>{k}</span>
                <span className="text-[color:var(--success)]">{v}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard>
          <div className="mb-3 text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[color:var(--warning)]" /> Recent Threats
          </div>
          <ul className="space-y-2 text-xs">
            {[
              ["Phishing site blocked", "drainer.xyz", "warning"],
              ["Suspicious approval", "0xab..12 · USDC", "danger"],
              ["MEV attempt", "Solana cluster", "warning"],
            ].map(([t, d, s], i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg border border-border bg-surface-1/40 p-3"
              >
                <span>
                  <b>{t}</b>
                  <div className="text-muted-foreground">{d}</div>
                </span>
                <span
                  className={`text-xs ${s === "danger" ? "text-[color:var(--danger)]" : "text-[color:var(--warning)]"}`}
                >
                  {s === "danger" ? "Critical" : "Medium"}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </>
  );
}
