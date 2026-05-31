// ─── Token Launchpad ───────────────────────────────────────────────
// Create and launch SPL tokens on Solana — no code needed

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useNativeWallet, shortAddr } from "@/lib/use-native-wallet";
import { Rocket, Coins, Image, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/launchpad")({
  head: () => ({ meta: [{ title: "Launchpad — Prophet" }] }),
  component: LaunchpadPage,
});

interface TokenForm {
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
  description: string;
  imageUri: string;
  website: string;
  twitter: string;
  telegram: string;
  burnMint: boolean;
  burnFreeze: boolean;
  revokeUpdate: boolean;
}

const EMPTY_FORM: TokenForm = {
  name: "",
  symbol: "",
  decimals: 9,
  supply: 1000000,
  description: "",
  imageUri: "",
  website: "",
  twitter: "",
  telegram: "",
  burnMint: true,
  burnFreeze: true,
  revokeUpdate: true,
};

function LaunchpadPage() {
  const { connected, publicKey } = useNativeWallet();
  const [form, setForm] = useState<TokenForm>(EMPTY_FORM);
  const [step, setStep] = useState<"form" | "review" | "creating" | "done">("form");
  const [error, setError] = useState("");

  const update = (key: keyof TokenForm, val: any) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const isValid =
    form.name.length >= 2 &&
    form.symbol.length >= 2 &&
    form.supply > 0 &&
    form.decimals >= 0 &&
    form.decimals <= 9;

  const estimatedCost = 0.05 + (form.imageUri ? 0.02 : 0); // SOL for mint + optional metadata

  const handleCreate = async () => {
    if (!connected || !publicKey) { setError("Connect wallet first"); return; }
    setStep("creating");
    setError("");
    try {
      // In production: call API route that uses @spl-token to mint
      // For now, simulate
      await new Promise((r) => setTimeout(r, 2000));
      setStep("done");
    } catch (e: any) {
      setError(e?.message || "Failed to create token");
      setStep("review");
    }
  };

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="text-5xl">🚀</div>
          <h1 className="text-xl font-bold">Token Launchpad</h1>
          <p className="text-sm text-muted-foreground">Connect your wallet to create SPL tokens</p>
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="text-5xl">🎉</div>
          <h1 className="text-xl font-bold text-[#14F195]">Token Created!</h1>
          <p className="text-sm text-muted-foreground">
            <b>{form.name}</b> ({form.symbol}) — {form.supply.toLocaleString()} supply
          </p>
          <button
            onClick={() => { setStep("form"); setForm(EMPTY_FORM); }}
            className="rounded-xl px-6 py-3 font-bold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #14F195, #9945FF)" }}
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "rgba(20,241,149,0.1)" }}>
          <Rocket className="h-5 w-5 text-[#14F195]" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Token Launchpad</h1>
          <p className="text-xs text-muted-foreground">Create SPL tokens on Solana — no code</p>
        </div>
      </div>

      {step === "creating" && (
        <div className="text-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#14F195] border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Creating {form.name} on Solana...</p>
        </div>
      )}

      {step === "form" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Token Name *</label>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="My Token"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-[#14F195]/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Symbol *</label>
              <input
                value={form.symbol}
                onChange={(e) => update("symbol", e.target.value.toUpperCase())}
                placeholder="MTK"
                maxLength={10}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-[#14F195]/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Decimals</label>
              <input
                type="number"
                value={form.decimals}
                onChange={(e) => update("decimals", parseInt(e.target.value) || 0)}
                min={0}
                max={9}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-[#14F195]/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Total Supply</label>
              <input
                type="number"
                value={form.supply}
                onChange={(e) => update("supply", parseInt(e.target.value) || 0)}
                min={1}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-[#14F195]/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe your token..."
              rows={3}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-[#14F195]/50 resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Image URL (IPFS/Arweave recommended)</label>
            <input
              value={form.imageUri}
              onChange={(e) => update("imageUri", e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-[#14F195]/50"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Website</label>
              <input
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-[#14F195]/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Twitter/X</label>
              <input
                value={form.twitter}
                onChange={(e) => update("twitter", e.target.value)}
                placeholder="@handle"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-[#14F195]/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Telegram</label>
              <input
                value={form.telegram}
                onChange={(e) => update("telegram", e.target.value)}
                placeholder="t.me/..."
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-[#14F195]/50"
              />
            </div>
          </div>

          {/* Security options */}
          <div className="rounded-xl p-4 space-y-3" style={{ border: "1px solid rgba(20,241,149,0.15)", background: "rgba(20,241,149,0.03)" }}>
            <div className="text-sm font-medium text-[#14F195]">🔒 Post-Launch Security</div>
            {[
              { key: "burnMint" as const, label: "Revoke Mint Authority", desc: "Makes supply immutable forever" },
              { key: "burnFreeze" as const, label: "Revoke Freeze Authority", desc: "Prevents token freeze" },
              { key: "revokeUpdate" as const, label: "Revoke Metadata Update", desc: "Locks name/description/image" },
            ].map((opt) => (
              <label key={opt.key} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[opt.key]}
                  onChange={(e) => update(opt.key, e.target.checked)}
                  className="mt-1 accent-[#14F195]"
                />
                <div>
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-[10px] text-muted-foreground">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="text-sm text-muted-foreground">Est. cost</div>
            <div className="text-lg font-bold">~{estimatedCost.toFixed(2)} SOL</div>
          </div>

          {error && (
            <div className="rounded-xl p-3 text-sm text-red-400" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertTriangle className="h-4 w-4 inline mr-2" />
              {error}
            </div>
          )}

          <button
            onClick={() => setStep("review")}
            disabled={!isValid}
            className="w-full h-12 rounded-xl font-bold text-sm disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #14F195, #9945FF)" }}
          >
            Review & Create
          </button>
        </>
      )}

      {step === "review" && (
        <div className="space-y-4">
          <div className="rounded-2xl p-6" style={{ background: "rgba(20,241,149,0.05)", border: "1px solid rgba(20,241,149,0.15)" }}>
            <div className="text-lg font-bold mb-4">Review Token</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Name:</span> <b>{form.name}</b></div>
              <div><span className="text-muted-foreground">Symbol:</span> <b>{form.symbol}</b></div>
              <div><span className="text-muted-foreground">Decimals:</span> <b>{form.decimals}</b></div>
              <div><span className="text-muted-foreground">Supply:</span> <b>{form.supply.toLocaleString()}</b></div>
              {form.description && <div className="col-span-2"><span className="text-muted-foreground">Description:</span> {form.description}</div>}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            {form.burnMint && <div className="flex items-center gap-2 text-[#14F195]"><CheckCircle2 className="h-4 w-4" /> Mint authority will be revoked</div>}
            {form.burnFreeze && <div className="flex items-center gap-2 text-[#14F195]"><CheckCircle2 className="h-4 w-4" /> Freeze authority will be revoked</div>}
            {form.revokeUpdate && <div className="flex items-center gap-2 text-[#14F195]"><CheckCircle2 className="h-4 w-4" /> Metadata will be locked</div>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setStep("form")} className="h-12 rounded-xl font-bold text-sm" style={{ border: "1px solid rgba(255,255,255,0.1)">
              Edit
            </button>
            <button
              onClick={handleCreate}
              className="h-12 rounded-xl font-bold text-sm text-white"
              style={{ background: "linear-gradient(135deg, #14F195, #9945FF)" }}
            >
              Create Token (~{estimatedCost.toFixed(2)} SOL)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
