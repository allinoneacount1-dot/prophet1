import { useState, lazy, Suspense } from "react";
import { Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNativeWallet, shortAddr } from "@/lib/use-native-wallet";

// ─── SSR-safe: lazy load the modal (never in SSR bundle) ──────────
const WalletModal = lazy(() => import("./WalletModal"));

export function ConnectWallet() {
  const [open, setOpen] = useState(false);
  const { connected, publicKey, selectedWallet, connecting, disconnect, wallets } =
    useNativeWallet();

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-1/60 px-3 py-2 text-xs font-medium hover:bg-white/5"
        >
          <span className="h-2 w-2 rounded-full bg-green-400 chain-glow" />
          <span className="font-mono">{shortAddr(publicKey)}</span>
          <span>{wallets.find((w) => w.key === selectedWallet)?.icon || "🔗"}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={disconnect}
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-2 text-xs text-red-400 hover:bg-red-500/20"
        >
          ✕
        </motion.button>
      </div>
    );
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        disabled={connecting}
        className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
      >
        <Wallet className="h-4 w-4" />
        {connecting ? "Connecting…" : "Connect Wallet"}
      </motion.button>
      <AnimatePresence>
        {open && (
          <Suspense fallback={null}>
            <WalletModal open={open} onClose={() => setOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
}
