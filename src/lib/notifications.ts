// ─── Notifications & Alerts ─────────────────────────────────────────
// Real-time price alerts + on-chain event monitoring
// Free APIs: CoinGecko (price), Helius (webhook), Bitquery (on-chain events)

import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { safeStorage } from "./security-utils";

// ─── Price Alert Types ──────────────────────────────────────────────
export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  direction: "above" | "below";
  triggered: boolean;
  createdAt: number;
}

// ─── On-chain Event Types ──────────────────────────────────────────
export interface OnChainEvent {
  id: string;
  type: "swap" | "transfer" | "stake" | "mint" | "burn" | "vote";
  description: string;
  txHash: string;
  timestamp: number;
  value?: string;
  source?: string;
}

// ─── Fetch whale transactions (large transfers) ────────────────────
const BITQUERY_API = "https://graphql.bitquery.io";

export async function fetchWhaleTransactions(
  tokenMint: string,
  minAmountUSD = 10000
): Promise<OnChainEvent[]> {
  try {
    const query = `
      query {
        solana {
          transfers(
            currency: { is: "${tokenMint}" }
            amount: { greaterThan: ${minAmountUSD} }
            options: { limit: 10, desc: "block.height" }
          ) {
            block { height timestamp { unixtime } }
            transaction { signature }
            sender { address }
            receiver { address }
            amount
            currency { symbol }
          }
        }
      }
    `;
    const res = await fetch(BITQUERY_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    const transfers = data?.data?.solana?.transfers || [];

    return transfers.map((t: any, i: number) => ({
      id: `whale-${i}-${t.transaction?.signature?.slice(0, 8)}`,
      type: "transfer" as const,
      description: `🐋 Whale: ${t.amount?.toFixed(2)} ${t.currency?.symbol} transferred`,
      txHash: t.transaction?.signature || "",
      timestamp: t.block?.timestamp?.unixtime || 0,
      value: `$${(t.amount * (t.currency?.symbol === "SOL" ? 150 : 1)).toFixed(0)}`,
      source: t.sender?.address?.slice(0, 8) + "…",
    }));
  } catch {
    return [];
  }
}

// ─── Fetch recent DEX trades (Jupiter) ─────────────────────────────
export async function fetchRecentDEXTrades(
  tokenMint: string,
  limit = 10
): Promise<OnChainEvent[]> {
  try {
    // Use Helius enhanced API for DEX trades
    const res = await fetch(
      `https://api.helius.xyz/v0/addresses/${tokenMint}/transactions?api-key=1d8740dc-e5f4-421c-b823-e1bad1889eff&type=SWAP&limit=${limit}`
    );
    if (!res.ok) throw new Error("Helius error");
    const data = await res.json();

    return data.map((tx: any, i: number) => ({
      id: `dex-${i}-${tx.signature?.slice(0, 8)}`,
      type: "swap" as const,
      description: `💱 DEX Swap: ${tx.description?.slice(0, 60) || "Token swap"}`,
      txHash: tx.signature || "",
      timestamp: tx.timestamp || 0,
      source: tx.feePayer?.slice(0, 8) + "…",
    }));
  } catch {
    return [];
  }
}

// ─── Fetch token mints (new launches) ──────────────────────────────
export async function fetchRecentMints(
  limit = 10
): Promise<OnChainEvent[]> {
  try {
    const res = await fetch(
      `https://api.helius.xyz/v0/token-metadata?api-key=1d8740dc-e5f4-421c-b823-e1bad1889eff&limit=${limit}`
    );
    if (!res.ok) throw new Error("Helius error");
    const data = await res.json();

    return data.map((m: any, i: number) => ({
      id: `mint-${i}-${m.mint?.slice(0, 8)}`,
      type: "mint" as const,
      description: `🪙 New Token: ${m.name || m.symbol || m.mint?.slice(0, 8)}`,
      txHash: m.signature || "",
      timestamp: m.timestamp || 0,
      value: m.symbol || "NEW",
    }));
  } catch {
    return [];
  }
}

// ─── Price Alert Hook ──────────────────────────────────────────────
export function usePriceAlerts(alerts: PriceAlert[]) {
  const symbols = [...new Set(alerts.map((a) => a.symbol))];

  const { data: prices } = useQuery({
    queryKey: ["alertPrices", symbols.join(",")],
    queryFn: async () => {
      if (symbols.length === 0) return {};
      const { fetchTokenPrices } = await import("./onchain");
      const prices = await fetchTokenPrices(symbols);
      return Object.fromEntries(prices.map((p) => [p.symbol.toUpperCase(), p.price]));
    },
    enabled: symbols.length > 0,
    refetchInterval: 15_000,
  });

  const triggeredAlerts = alerts.filter((alert) => {
    if (alert.triggered) return false;
    const price = prices?.[alert.symbol.toUpperCase()];
    if (!price) return false;
    return alert.direction === "above"
      ? price >= alert.targetPrice
      : price <= alert.targetPrice;
  });

  return { triggeredAlerts, prices: prices || {} };
}

// ─── On-chain Events Hook ──────────────────────────────────────────
export function useOnChainEvents(address: string | null) {
  return useQuery({
    queryKey: ["onchainEvents", address],
    queryFn: async () => {
      if (!address) return [];
      const { fetchTransactionHistory } = await import("./onchain");
      const txs = await fetchTransactionHistory(address);
      return txs.slice(0, 20).map((tx: any, i: number) => ({
        id: `tx-${i}-${tx.signature?.slice(0, 8)}`,
        type: (tx.type || "transfer") as OnChainEvent["type"],
        description: tx.description?.slice(0, 80) || `Transaction ${tx.signature?.slice(0, 8)}…`,
        txHash: tx.signature || "",
        timestamp: tx.timestamp || 0,
        source: tx.feePayer?.slice(0, 8) + "…",
      }));
    },
    enabled: !!address,
    refetchInterval: 30_000,
  });
}

// ─── Whale Alerts Hook ─────────────────────────────────────────────
export function useWhaleAlerts() {
  return useQuery({
    queryKey: ["whaleAlerts"],
    queryFn: async () => {
      const events = await fetchWhaleTransactions(
        "So11111111111111111111111111111111111111112",
        50000
      );
      return events.slice(0, 5);
    },
    refetchInterval: 60_000,
  });
}


// ─── Local Storage for Price Alerts ────────────────────────────────
export function loadAlerts(): PriceAlert[] {
  return safeStorage.getJSON<PriceAlert[]>("ps:priceAlerts", []);
}

export function saveAlerts(alerts: PriceAlert[]) {
  safeStorage.setJSON("ps:priceAlerts", alerts);
}

export function addAlert(alert: Omit<PriceAlert, "id" | "triggered" | "createdAt">): PriceAlert {
  const newAlert: PriceAlert = {
    ...alert,
    id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    triggered: false,
    createdAt: Date.now(),
  };
  const alerts = loadAlerts();
  alerts.push(newAlert);
  saveAlerts(alerts);
  return newAlert;
}

export function removeAlert(id: string) {
  const alerts = loadAlerts().filter((a) => a.id !== id);
  saveAlerts(alerts);
}
