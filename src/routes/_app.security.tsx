import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { StatCard } from "@/components/app/StatCard";
import { ShieldCheck, AlertTriangle, Eye, ScanLine, Search, CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";
import { useNativeWallet, shortAddr } from "@/lib/use-native-wallet";
import { useQuery } from "@tanstack/react-query";
import { getTokenSecurity, getRugCheckReport, assessWalletRisk, verifyContract, type TokenSecurity, type RugCheckResult, type WalletRisk } from "@/lib/security";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/security")({
  head: () => ({ meta: [{ title: "Security Center — Prophet" }] }),
  component: Security,
});

// ─── Token Scanner Component ───────────────────────────────────────
function TokenScanner() {
  const [addr, setAddr] = useState("");
  const [chain, setChain] = useState<"solana" | "ethereum" | "bnb" | "base">("solana");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<TokenSecurity | RugCheckResult | null>(null);

  const handleScan = async () => {
    if (!addr.trim()) return;
    setScanning(true);
    setResult(null);

    try {
      // Try RugCheck first (Solana-specific, more detailed)
      if (chain === "solana") {
        const rugReport = await getRugCheckReport(addr.trim());
        if (rugReport) {
          setResult(rugReport);
          return;
        }
      }

      // Fallback to GoPlus (multi-chain)
      const security = await getTokenSecurity(addr.trim(), chain);
      if (security) {
        setResult(security);
      } else {
        toast.error("Could not fetch security data. Try again.");
      }
    } catch (e: any) {
      toast.error(e.message || "Scan failed");
    } finally {
      setScanning(false);
    }
  };

  const isRugCheck = result && "score" in result && "risks" in result;
  const isGoPlus = result && "riskScore" in result;

  return (
    <GlassCard glow>
      <div className="mb-3 text-sm font-semibold flex items-center gap-2">
        <ScanLine className="h-4 w-4 text-[color:var(--chain)]" /> Token Scanner
      </div>
      <div className="flex gap-2">
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value as any)}
          className="rounded-lg border border-border bg-surface-2/60 px-2 py-2 text-sm"
        >
          <option value="solana">Solana</option>
          <option value="ethereum">Ethereum</option>
          <option value="bnb">BNB Chain</option>
          <option value="base">Base</option>
        </select>
        <input
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          placeholder="Token address / mint…"
          className="h-10 flex-1 rounded-lg border border-border bg-surface-1/60 px-3 text-sm font-mono outline-none focus:border-[color:var(--chain)]"
        />
        <button
          onClick={handleScan}
          disabled={scanning || !addr.trim()}
          className="h-10 rounded-lg bg-[linear-gradient(135deg,var(--prophet),var(--chain))] px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </button>
      </div>

      {/* Results */}
      {isGoPlus && <GoPlusResult data={result as TokenSecurity} />}
      {isRugCheck && <RugCheckResult data={result as RugCheckResult} />}
    </GlassCard>
  );
}

function GoPlusResult({ data }: { data: TokenSecurity }) {
  const riskColor =
    data.riskLevel === "low" ? "text-[color:var(--success)]" :
    data.riskLevel === "medium" ? "text-yellow-400" :
    data.riskLevel === "high" ? "text-orange-400" : "text-red-400";

  return (
    <div className="mt-4 space-y-3">
      {/* Risk Score */}
      <div className="flex items-center justify-between rounded-xl border border-border p-3">
        <div>
          <div className="text-sm font-semibold">{data.name} ({data.symbol})</div>
          <div className="text-xs text-muted-foreground font-mono">{data.address.slice(0, 12)}…</div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${riskColor}`}>{data.riskScore}</div>
          <div className={`text-[10px] uppercase font-bold ${riskColor}`}>{data.riskLevel} risk</div>
        </div>
      </div>

      {/* Warnings */}
      {data.warnings.length > 0 && (
        <div className="space-y-1">
          {data.warnings.map((w, i) => (
            <div key={i} className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2 text-xs">
              {w}
            </div>
          ))}
        </div>
      )}

      {/* Checks */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          ["Honeypot", !data.isHoneypot],
          ["Mintable", !data.isMintable],
          ["Blacklist", !data.isBlacklisted],
          ["Can Sell All", !data.cannotSellAll],
          ["Ownership Renounced", data.ownershipRenounced],
          ["LP Locked", data.liquidityLocked],
          ["Hidden Owner", !data.hiddenOwner],
          ["Trade Cooldown", !data.tradingCooldown],
        ].map(([label, pass]) => (
          <div key={label as string} className="flex items-center gap-2 rounded-lg border border-border bg-surface-1/40 p-2">
            {pass ? (
              <CheckCircle className="h-3.5 w-3.5 text-[color:var(--success)] shrink-0" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
            )}
            <span className={pass ? "text-foreground/70" : "text-red-400"}>{label as string}</span>
          </div>
        ))}
      </div>

      {data.buyTax !== undefined && data.buyTax > 0 && (
        <div className="text-xs text-muted-foreground">
          Buy Tax: {data.buyTax.toFixed(1)}% · Sell Tax: {data.sellTax?.toFixed(1) || 0}%
        </div>
      )}
    </div>
  );
}

function RugCheckResult({ data }: { data: RugCheckResult }) {
  const riskScore = data.score;
  const riskColor =
    riskScore < 200 ? "text-[color:var(--success)]" :
    riskScore < 500 ? "text-yellow-400" :
    riskScore < 800 ? "text-orange-400" : "text-red-400";

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between rounded-xl border border-border p-3">
        <div>
          <div className="text-sm font-semibold">{data.tokenInfo?.name || "Unknown"} ({data.tokenInfo?.symbol || "?"})</div>
          <div className="text-xs text-muted-foreground">
            {data.tokenInfo?.verified ? "✅ Verified" : "⚠️ Unverified"} · {data.markets?.length || 0} markets
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${riskColor}`}>{riskScore}</div>
          <div className={`text-[10px] uppercase font-bold ${riskColor}`}>
            {riskScore < 200 ? "Safe" : riskScore < 500 ? "Low Risk" : riskScore < 800 ? "Medium Risk" : "High Risk"}
          </div>
        </div>
      </div>

      {/* Risks */}
      {data.risks && data.risks.length > 0 && (
        <div className="space-y-1">
          {data.risks.slice(0, 8).map((r, i) => (
            <div
              key={i}
              className={`rounded-lg border px-3 py-2 text-xs ${
                r.level === "danger"
                  ? "border-red-500/20 bg-red-500/5 text-red-400"
                  : r.level === "warn"
                  ? "border-yellow-500/20 bg-yellow-500/5 text-yellow-400"
                  : "border-border bg-surface-1/40 text-muted-foreground"
              }`}
            >
              <span className="font-medium">{r.name}</span>
              {r.description && <span className="ml-1 opacity-70">— {r.description}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Top Holders */}
      {data.topHolders && data.topHolders.length > 0 && (
        <div>
          <div className="text-xs text-muted-foreground mb-1">Top Holders</div>
          <div className="space-y-1">
            {data.topHolders.slice(0, 5).map((h, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-surface-1/40 px-2 py-1.5 text-[11px]">
                <span className="font-mono text-muted-foreground">{h.address.slice(0, 8)}…{h.address.slice(-4)}</span>
                <span className="tabular-nums">{h.pct.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LP Locked */}
      {data.lpLocked !== undefined && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">LP Locked</span>
          <span className={data.lpLocked > 80 ? "text-[color:var(--success)]" : "text-yellow-400"}>
            {data.lpLocked.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Wallet Risk Component ─────────────────────────────────────────
function WalletRiskCard() {
  const { connected, publicKey } = useNativeWallet();

  const { data: risk, isLoading } = useQuery({
    queryKey: ["walletRisk", publicKey],
    queryFn: () => assessWalletRisk(publicKey!),
    enabled: !!publicKey,
    staleTime: 60_000,
  });

  if (!connected) {
    return (
      <GlassCard>
        <div className="mb-3 text-sm font-semibold flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[color:var(--chain)]" /> Wallet Risk
        </div>
        <div className="py-6 text-center text-xs text-muted-foreground">Connect wallet to assess risk</div>
      </GlassCard>
    );
  }

  const levelColor =
    risk?.level === "low" ? "text-[color:var(--success)]" :
    risk?.level === "medium" ? "text-yellow-400" :
    risk?.level === "high" ? "text-orange-400" : "text-red-400";

  return (
    <GlassCard>
      <div className="mb-3 text-sm font-semibold flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-[color:var(--chain)]" /> Wallet Risk
      </div>
      {isLoading ? (
        <div className="py-6 text-center text-xs text-muted-foreground">Analyzing wallet…</div>
      ) : risk ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <div>
              <div className="text-xs text-muted-foreground">{shortAddr(publicKey)}</div>
              <div className="text-sm font-medium mt-1">{risk.flags.length} flags detected</div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${levelColor}`}>{risk.score}</div>
              <div className={`text-[10px] uppercase font-bold ${levelColor}`}>{risk.level} risk</div>
            </div>
          </div>
          {risk.flags.length > 0 && (
            <div className="space-y-1">
              {risk.flags.map((f, i) => (
                <div
                  key={i}
                  className={`rounded-lg border px-3 py-2 text-xs ${
                    f.severity === "danger"
                      ? "border-red-500/20 bg-red-500/5 text-red-400"
                      : f.severity === "warn"
                      ? "border-yellow-500/20 bg-yellow-500/5 text-yellow-400"
                      : "border-border bg-surface-1/40 text-muted-foreground"
                  }`}
                >
                  <span className="font-medium">{f.type}:</span> {f.description}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </GlassCard>
  );
}

// ─── Main Security Page ────────────────────────────────────────────
function Security() {
  return (
    <>
      <PageHeader
        eyebrow="Security"
        title="Security Center"
        description="Token safety scanner, wallet risk assessment, and contract verification — powered by GoPlus & RugCheck."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Scanner" value="GoPlus" delta={{ value: "Multi-chain", positive: true }} icon={<ScanLine className="h-4 w-4" />} />
        <StatCard label="Solana" value="RugCheck" delta={{ value: "Detailed", positive: true }} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Wallet" value="Live" delta={{ value: "Risk analysis", positive: true }} icon={<Eye className="h-4 w-4" />} />
        <StatCard label="Threats" value="Real-time" delta={{ value: "Monitoring", positive: true }} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <TokenScanner />
        <WalletRiskCard />
      </div>

      {/* Info */}
      <div className="mt-8 glass-strong rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold">Security APIs</div>
            <div className="mt-1 text-xs text-muted-foreground space-y-1">
              <p>• <b>GoPlus Token Security</b> — Multi-chain token analysis (honeypot, mint, blacklist, taxes)</p>
              <p>• <b>RugCheck</b> — Solana-specific token verification (top holders, LP lock, risks)</p>
              <p>• <b>Wallet Risk</b> — On-chain activity analysis (balance, tx patterns, age)</p>
              <p>• All scans are read-only. No transactions are signed.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
