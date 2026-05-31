// ─── On-chain data hooks ────────────────────────────────────────────
// Real on-chain data via TanStack Query (cached, auto-refetching)

import { useQuery } from "@tanstack/react-query";
import {
  fetchPortfolio,
  fetchSinglePrice,
  fetchJupiterQuote,
  fetchSolBalance,
  fetchLiFiQuote,
} from "./onchain";
export {
  fetchPortfolio,
  fetchSinglePrice,
  fetchJupiterQuote,
  fetchSolBalance,
  fetchLiFiQuote,
} from "./onchain";
export type { PortfolioData, TokenPrice, JupiterQuote, BridgeQuote } from "./onchain";

// ─── Portfolio Hook ─────────────────────────────────────────────────
// Returns real on-chain portfolio data for a given address
export function useOnChainPortfolio(address: string | null) {
  return useQuery({
    queryKey: ["portfolio", address],
    queryFn: () => fetchPortfolio(address!),
    enabled: !!address && address.length > 20,
    refetchInterval: 30_000, // refresh every 30s
    staleTime: 15_000,
  });
}

// ─── SOL Balance Hook ───────────────────────────────────────────────
export function useSolBalance(address: string | null) {
  return useQuery({
    queryKey: ["solBalance", address],
    queryFn: () => fetchSolBalance(address!),
    enabled: !!address && address.length > 20,
    refetchInterval: 15_000,
  });
}

// ─── Token Price Hook ───────────────────────────────────────────────
export function useTokenPrice(symbol: string) {
  return useQuery({
    queryKey: ["price", symbol],
    queryFn: () => fetchSinglePrice(symbol),
    enabled: !!symbol,
    refetchInterval: 30_000,
  });
}

// ─── Jupiter Quote Hook ─────────────────────────────────────────────
export function useJupiterQuote(
  inputMint: string | null,
  outputMint: string | null,
  amount: number | null,
  decimals: number
) {
  return useQuery({
    queryKey: ["jupiterQuote", inputMint, outputMint, amount],
    queryFn: () => {
      if (!inputMint || !outputMint || !amount) return null;
      const amountSmallest = Math.floor(amount * Math.pow(10, decimals));
      if (amountSmallest <= 0) return null;
      return fetchJupiterQuote(inputMint, outputMint, amountSmallest);
    },
    enabled: !!inputMint && !!outputMint && !!amount && amount > 0,
    staleTime: 10_000,
  });
}

// ─── Li.Fi Bridge Quote Hook ────────────────────────────────────────
export function useLiFiQuote(
  fromChain: string,
  toChain: string,
  fromToken: string,
  toToken: string,
  amount: number
) {
  return useQuery({
    queryKey: ["lifiQuote", fromChain, toChain, fromToken, toToken, amount],
    queryFn: () => fetchLiFiQuote(fromChain, toChain, fromToken, toToken, amount * 1e6),
    enabled: !!fromChain && !!toChain && !!fromToken && !!toToken && amount > 0,
    staleTime: 15_000,
  });
}
