import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  TrustWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// ─── SSR-safe: this component only renders on client ────────────────
export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <SolanaWalletInner>{children}</SolanaWalletInner>;
}

const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

function SolanaWalletInner({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => SOLANA_RPC, []);

  // Register wallet adapters (only happens on client)
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new TrustWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

  const onError = useCallback((error: WalletError) => {
    console.warn("[Solana Wallet]", error.message);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}

// ─── Helper: useSolanaWallet ────────────────────────────────────────
export function useSolanaWallet(): {
  connected: boolean;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  select: (walletName: string) => void;
  wallet: { adapter: { name: string; icon: string } } | null;
  wallets: { adapter: { name: string; icon: string; readyState: string } }[];
  connecting: boolean;
  disconnecting: boolean;
} {
  const {
    wallet,
    wallets,
    select,
    connect,
    disconnect,
    connecting,
    disconnecting,
    connected,
    publicKey,
  } = useWallet();

  const address = publicKey?.toBase58() ?? null;

  return {
    connected,
    publicKey: address,
    connect: connect as () => Promise<void>,
    disconnect: disconnect as () => Promise<void>,
    select: select as (walletName: string) => void,
    wallet: wallet
      ? { adapter: { name: wallet.adapter.name, icon: wallet.adapter.icon } }
      : null,
    wallets: wallets.map((w) => ({
      adapter: {
        name: w.adapter.name,
        icon: w.adapter.icon,
        readyState: String(w.readyState),
      },
    })),
    connecting,
    disconnecting,
  };
}

export { useConnection };
