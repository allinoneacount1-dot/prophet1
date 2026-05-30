import { useState, useCallback } from "react";
import { Wallet, ChevronDown, ExternalLink, LogOut, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSolanaWallet, useConnection } from "@/lib/solana-wallet";

const WALLET_INFO: Record<string, { label: string; installUrl: string }> = {
  "Phantom": {
    label: "Phantom",
    installUrl: "https://phantom.app/download",
  },
  "Solflare": {
    label: "Solflare",
    installUrl: "https://solflare.com/download",
  },
  "Coinbase Wallet": {
    label: "Coinbase Wallet",
    installUrl: "https://www.coinbase.com/wallet",
  },
  "Trust Wallet": {
    label: "Trust Wallet",
    installUrl: "https://trustwallet.com/download",
  },
  "Ledger": {
    label: "Ledger",
    installUrl: "https://www.ledger.com/ledger-live",
  },
};

function shortAddr(a: string | null) {
  if (!a) return "";
  return a.slice(0, 4) + "…" + a.slice(-4);
}

export function ConnectWallet() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <>
      <WalletButton onClick={() => setOpen(true)} />
      <AnimatePresence>
        {open && (
          <WalletModal
            onClose={() => setOpen(false)}
            copied={copied}
            setCopied={setCopied}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function WalletButton({ onClick }: { onClick: () => void }) {
  const { connected, publicKey, wallet, connecting, disconnect, disconnecting } =
    useSolanaWallet();

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClick}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-1/60 px-3 py-2 text-xs font-medium hover:bg-white/5"
        >
          <span className="h-2 w-2 rounded-full bg-green-400 chain-glow" />
          <span className="font-mono">{shortAddr(publicKey)}</span>
          {wallet && (
            <img
              src={wallet.adapter.icon}
              alt={wallet.adapter.name}
              className="h-4 w-4"
            />
          )}
          <ChevronDown className="h-3 w-3 opacity-60" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={disconnect}
          disabled={disconnecting}
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-2 text-xs text-red-400 hover:bg-red-500/20"
        >
          <LogOut className="h-3 w-3" />
        </motion.button>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={connecting}
      className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
    >
      <Wallet className="h-4 w-4" />
      {connecting ? "Connecting…" : "Connect Wallet"}
    </motion.button>
  );
}

function WalletModal({
  onClose,
  copied,
  setCopied,
}: {
  onClose: () => void;
  copied: boolean;
  setCopied: (v: boolean) => void;
}) {
  const { connected, publicKey, wallet, wallets, select, connect, connecting } =
    useSolanaWallet();

  const handleCopy = useCallback(() => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [publicKey, setCopied]);

  const handleDisconnect = useCallback(async () => {
    const { disconnect } = useSolanaWallet();
    await disconnect();
    onClose();
  }, [onClose]);

  const handleConnect = useCallback(
    async (walletName: string) => {
      try {
        select(walletName);
        await connect();
      } catch (e) {
        console.warn("Wallet connection failed:", e);
      }
    },
    [select, connect]
  );

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
        className="w-full max-w-md rounded-2xl border border-border bg-surface-1 p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Connected state */}
        {connected && publicKey && (
          <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-sm font-medium text-green-400">
                Connected
              </span>
              {wallet && (
                <img
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                  className="h-4 w-4"
                />
              )}
              {wallet && (
                <span className="text-xs text-muted-foreground">
                  {wallet.adapter.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 font-mono text-sm text-foreground">
                {shortAddr(publicKey)}
              </code>
              <button
                onClick={handleCopy}
                className="rounded-md p-1 text-muted-foreground hover:bg-white/5"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Wallet options */}
        {!connected && (
          <div className="space-y-2">
            {wallets.length === 0 ? (
              <div className="space-y-3">
                {Object.entries(WALLET_INFO).map(([key, info]) => (
                  <WalletOption
                    key={key}
                    name={info.label}
                    icon={`/wallets/${key.toLowerCase().replace(/\s+/g, "-")}.svg`}
                    installUrl={info.installUrl}
                    onConnect={() => handleConnect(key)}
                    connecting={connecting}
                  />
                ))}
              </div>
            ) : (
              wallets.map((w) => {
                const info =
                  WALLET_INFO[w.adapter.name] || {
                    label: w.adapter.name,
                    installUrl: "#",
                  };
                return (
                  <WalletOption
                    key={w.adapter.name}
                    name={w.adapter.name}
                    icon={w.adapter.icon}
                    installUrl={info.installUrl}
                    installing={
                      w.adapter.readyState === "NotDetected" ||
                      w.adapter.readyState === "Loadable"
                    }
                    onConnect={() => handleConnect(w.adapter.name)}
                    connecting={connecting}
                  />
                );
              })
            )}
          </div>
        )}

        {/* Disconnect */}
        {connected && (
          <button
            onClick={handleDisconnect}
            className="mt-2 w-full rounded-xl border border-red-500/30 bg-red-500/10 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20"
          >
            Disconnect
          </button>
        )}

        <p className="mt-4 text-center text-[10px] text-muted-foreground">
          By connecting, you agree to Prophet Terms of Service
        </p>
      </motion.div>
    </motion.div>
  );
}

function WalletOption({
  name,
  icon,
  installUrl,
  installing,
  onConnect,
  connecting,
}: {
  name: string;
  icon: string;
  installUrl: string;
  installing?: boolean;
  onConnect: () => void;
  connecting: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  if (installing) {
    return (
      <a
        href={installUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface-1/60 px-4 py-3 text-sm hover:bg-white/5"
      >
        {!imgError ? (
          <img
            src={icon}
            alt={name}
            className="h-8 w-8 rounded-lg"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-lg">
            🔗
          </div>
        )}
        <div className="flex-1 text-left">
          <div className="font-medium">{name}</div>
          <div className="text-xs text-yellow-400">Install to connect</div>
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground" />
      </a>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={connecting}
      className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface-1/60 px-4 py-3 text-sm hover:bg-white/5 disabled:opacity-50"
    >
      {!imgError ? (
        <img
          src={icon}
          alt={name}
          className="h-8 w-8 rounded-lg"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-lg">
          🔗
        </div>
      )}
      <div className="flex-1 text-left">
        <div className="font-medium">{name}</div>
      </div>
      {connecting ? (
        <span className="text-xs text-muted-foreground">Connecting…</span>
      ) : (
        <span className="rounded-md bg-[color:var(--chain)]/20 px-2 py-1 text-xs font-medium">
          Connect
        </span>
      )}
    </button>
  );
}
