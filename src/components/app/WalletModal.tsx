import { useState } from "react";
import { ExternalLink, Copy, Check, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useNativeWallet, shortAddr } from "@/lib/use-native-wallet";

export default function WalletModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    wallets,
    connected,
    publicKey,
    selectedWallet,
    connecting,
    connect,
    disconnect,
  } = useNativeWallet();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = async (key: string) => {
    await connect(key);
  };

  const handleDisconnect = async () => {
    await disconnect();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-border bg-surface-1 p-5 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Connected state */}
        {connected && publicKey && (
          <>
            <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-xs font-medium text-green-400">Connected</span>
                <span>{wallets.find((w) => w.key === selectedWallet)?.icon}</span>
                <span className="text-xs text-muted-foreground">
                  {wallets.find((w) => w.key === selectedWallet)?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-xs text-foreground">
                  {shortAddr(publicKey)}
                </code>
                <button
                  onClick={handleCopy}
                  className="rounded-md p-1 text-muted-foreground hover:bg-white/5"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="w-full rounded-xl border border-red-500/30 bg-red-500/10 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20"
            >
              Disconnect
            </button>
          </>
        )}

        {/* Wallet list */}
        {!connected && (
          <div className="space-y-1.5">
            {wallets.map((w) => (
              <button
                key={w.key}
                onClick={() => w.ready && handleConnect(w.key)}
                disabled={!w.ready || connecting}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface-1/60 px-3 py-2.5 text-xs hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-surface-1/60"
              >
                <span className="text-lg">{w.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{w.name}</div>
                  {!w.ready && (
                    <div className="text-[10px] text-yellow-400">Install to connect</div>
                  )}
                </div>
                {w.ready ? (
                  connecting ? (
                    <span className="text-[10px] text-muted-foreground">Connecting…</span>
                  ) : (
                    <span className="rounded-md bg-[color:var(--chain)]/20 px-2 py-0.5 text-[10px] font-medium">
                      Connect
                    </span>
                  )
                ) : (
                  <a
                    href={w.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-md border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-white/5"
                  >
                    Install
                  </a>
                )}
              </button>
            ))}
          </div>
        )}

        <p className="mt-3 text-center text-[9px] text-muted-foreground">
          Zero dependencies · Native wallet injection
        </p>
      </motion.div>
    </motion.div>
  );
}
