import { useState, useEffect, useCallback, useRef } from "react";

// ─── Wallet detection via browser extension injection ───────────────
// Zero dependencies — langsung detect window.solana, window.solflare, etc.

interface WalletDescriptor {
  key: string;
  name: string;
  icon: string;
  downloadUrl: string;
  provider: (() => WalletProvider) | null;
  ready: boolean;
}

interface WalletProvider {
  isConnected: boolean;
  publicKey: { toBase58: () => string } | null;
  connect: () => Promise<{ publicKey: { toBase58: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, cb: () => void) => void;
  off: (event: string, cb: () => void) => void;
  signMessage?: (msg: Uint8Array) => Promise<{ signature: Uint8Array }>;
  signAndSendTransaction?: (tx: any) => Promise<{ signature: string }>;
  signTransaction?: (tx: any) => Promise<any>;
}

const KNOWN_WALLETS = [
  { key: "phantom", name: "Phantom", icon: "👻", url: "https://phantom.app/download" },
  { key: "solflare", name: "Solflare", icon: "🔥", url: "https://solflare.com/download" },
  { key: "coinbase", name: "Coinbase Wallet", icon: "🔵", url: "https://www.coinbase.com/wallet" },
  { key: "trust", name: "Trust Wallet", icon: "🛡️", url: "https://trustwallet.com/download" },
  { key: "backpack", name: "Backpack", icon: "🎒", url: "https://backpack.app/download" },
  { key: "glow", name: "Glow", icon: "✨", url: "https://glow.app/download" },
] as const;

function getProvider(key: string): (() => WalletProvider) | null {
  if (typeof window === "undefined") return null;
  try {
    const w = window as any;
    switch (key) {
      case "phantom":
        return w.phantom?.solana ? (() => w.phantom.solana) : null;
      case "solflare":
        return w.solflare?.isSolflare ? (() => w.solflare) : null;
      case "coinbase":
        return w.coinbaseWalletExtension ? (() => w.coinbaseWalletExtension) : null;
      case "trust":
        return w.trustwallet?.solana ? (() => w.trustwallet.solana) : null;
      case "backpack":
        return w.backpack?.isBackpack ? (() => w.backpack) : null;
      case "glow":
        return w.glow?.isGlow ? (() => w.glow) : null;
      default:
        return null;
    }
  } catch {
    return null;
  }
}

export function useNativeWallet() {
  const [wallets, setWallets] = useState<WalletDescriptor[]>([]);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const listenerRef = useRef<(() => void) | null>(null);

  // Detect available wallets
  useEffect(() => {
    const detected = KNOWN_WALLETS.map((w) => ({
      key: w.key,
      name: w.name,
      icon: w.icon,
      downloadUrl: w.url,
      provider: getProvider(w.key),
      ready: !!getProvider(w.key),
    }));
    setWallets(detected);

    // Check if already connected (Phantom auto-connect)
    const phantomProvider = getProvider("phantom")?.();
    if (phantomProvider?.isConnected && phantomProvider?.publicKey) {
      setConnected(true);
      setPublicKey(phantomProvider.publicKey.toBase58());
      setSelectedWallet("phantom");
    }
  }, []);

  // Connect to a wallet
  const connect = useCallback(async (key: string) => {
    const provider = getProvider(key);
    if (!provider) return;
    setConnecting(true);
    try {
      const p = provider();
      const result = await p.connect();
      const addr = result.publicKey.toBase58();
      setPublicKey(addr);
      setConnected(true);
      setSelectedWallet(key);

      // Listen for disconnect
      const handler = () => {
        setConnected(false);
        setPublicKey(null);
        setSelectedWallet(null);
      };
      listenerRef.current = handler;
      p.on("disconnect", handler);

      // Persist
      try {
        localStorage.setItem("ps:wallet", key);
        localStorage.setItem("ps:addr", addr);
      } catch {}
    } catch (e) {
      console.warn(`[wallet] connect failed for ${key}:`, e);
    } finally {
      setConnecting(false);
    }
  }, []);

  // Disconnect
  const disconnect = useCallback(async () => {
    if (!selectedWallet) return;
    const provider = getProvider(selectedWallet);
    if (!provider) return;
    try {
      const p = provider();
      if (listenerRef.current) {
        try { p.off("disconnect", listenerRef.current); } catch {}
      }
      await p.disconnect();
    } catch {}
    setConnected(false);
    setPublicKey(null);
    setSelectedWallet(null);
    try {
      localStorage.removeItem("ps:wallet");
      localStorage.removeItem("ps:addr");
    } catch {}
  }, [selectedWallet]);

  return {
    wallets,
    connected,
    publicKey,
    selectedWallet,
    connecting,
    connect,
    disconnect,
  };
}

export function shortAddr(a: string | null) {
  if (!a) return "";
  return a.slice(0, 4) + "…" + a.slice(-4);
}
