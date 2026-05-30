import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Chain = "solana" | "bnb" | "base" | "ethereum";

export const CHAINS: { id: Chain; label: string; symbol: string; color: string }[] = [
  { id: "solana", label: "Solana", symbol: "SOL", color: "#14F195" },
  { id: "bnb", label: "BNB Chain", symbol: "BNB", color: "#F0B90B" },
  { id: "base", label: "Base", symbol: "ETH", color: "#0052FF" },
  { id: "ethereum", label: "Ethereum", symbol: "ETH", color: "#8A92B2" },
];

export type Wallet = "phantom" | "metamask" | "trust" | "base" | "okx";
export const WALLETS: { id: Wallet; label: string }[] = [
  { id: "phantom", label: "Phantom" },
  { id: "metamask", label: "MetaMask" },
  { id: "trust", label: "Trust Wallet" },
  { id: "base", label: "Base Wallet" },
  { id: "okx", label: "OKX Wallet" },
];

type Ctx = {
  chain: Chain;
  setChain: (c: Chain) => void;
  wallet: Wallet | null;
  setWallet: (w: Wallet | null) => void;
  address: string | null;
  connect: (w: Wallet) => void;
  disconnect: () => void;
  connected: boolean;
};

const ChainCtx = createContext<Ctx | null>(null);

function mockAddr() {
  const chars = "0123456789abcdef";
  let s = "0x";
  for (let i = 0; i < 40; i++) s += chars[Math.floor(Math.random() * 16)];
  return s;
}

export function ChainProvider({ children }: { children: ReactNode }) {
  const [chain, setChain] = useState<Chain>("solana");
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-chain", chain);
    }
  }, [chain]);

  // restore from localStorage
  useEffect(() => {
    try {
      const w = localStorage.getItem("ps:wallet") as Wallet | null;
      const a = localStorage.getItem("ps:addr");
      const c = localStorage.getItem("ps:chain") as Chain | null;
      if (w) setWallet(w);
      if (a) setAddress(a);
      if (c) setChain(c);
    } catch {}
  }, []);

  function connect(w: Wallet) {
    const a = mockAddr();
    setWallet(w);
    setAddress(a);
    try {
      localStorage.setItem("ps:wallet", w);
      localStorage.setItem("ps:addr", a);
    } catch {}
  }
  function disconnect() {
    setWallet(null);
    setAddress(null);
    try {
      localStorage.removeItem("ps:wallet");
      localStorage.removeItem("ps:addr");
    } catch {}
  }

  function setChainPersist(c: Chain) {
    setChain(c);
    try {
      localStorage.setItem("ps:chain", c);
    } catch {}
  }

  return (
    <ChainCtx.Provider
      value={{
        chain,
        setChain: setChainPersist,
        wallet,
        setWallet,
        address,
        connect,
        disconnect,
        connected: !!wallet,
      }}
    >
      {children}
    </ChainCtx.Provider>
  );
}

export function useChain() {
  const ctx = useContext(ChainCtx);
  if (!ctx) throw new Error("useChain must be used within ChainProvider");
  return ctx;
}

export function shortAddr(a: string | null) {
  if (!a) return "";
  return a.slice(0, 6) + "…" + a.slice(-4);
}
