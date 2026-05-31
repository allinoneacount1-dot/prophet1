// ─── Backend API Routes ─────────────────────────────────────────────
// Server-side endpoints for TMA: portfolio, referral, leaderboard
// Uses TanStack Start server functions

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetchPortfolio, fetchSinglePrice } from "@/lib/onchain";
import { verifyTelegramInitData } from "@/lib/telegram-auth";

// ─── Portfolio API ─────────────────────────────────────────────────
export const getPortfolio = createServerFn({ method: "GET" })
  .inputValidator(z.object({ address: z.string().min(32) }))
  .handler(async ({ data }) => {
    try {
      const portfolio = await fetchPortfolio(data.address);
      return { success: true, data: portfolio };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// ─── Price API ─────────────────────────────────────────────────────
export const getPrice = createServerFn({ method: "GET" })
  .inputValidator(z.object({ symbol: z.string().min(1) }))
  .handler(async ({ data }) => {
    try {
      const price = await fetchSinglePrice(data.symbol);
      return { success: true, data: { symbol: data.symbol, price } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// ─── Telegram Auth API ─────────────────────────────────────────────
export const verifyTelegramUser = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    initData: z.string().min(10),
    botToken: z.string().min(10),
  }))
  .handler(async ({ data }) => {
    try {
      const user = verifyTelegramInitData(data.initData, data.botToken);
      if (!user) {
        return { success: false, error: "Invalid initData" };
      }
      return { success: true, data: user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// ─── Leaderboard API ───────────────────────────────────────────────
// In production, this would query a database
const LEADERBOARD_DATA = [
  { rank: 1, name: "CryptoOracle", xp: 48200, badges: 12, winRate: 94 },
  { rank: 2, name: "DeFiWhale", xp: 42100, badges: 10, winRate: 91 },
  { rank: 3, name: "AlphaSeeker", xp: 38900, badges: 9, winRate: 88 },
  { rank: 4, name: "GemHunter", xp: 35400, badges: 8, winRate: 86 },
  { rank: 5, name: "SolMaxi", xp: 32100, badges: 8, winRate: 84 },
  { rank: 6, name: "NFTCollector", xp: 28700, badges: 7, winRate: 82 },
  { rank: 7, name: "StakeKing", xp: 25300, badges: 7, winRate: 79 },
  { rank: 8, name: "BridgeMaster", xp: 22800, badges: 6, winRate: 77 },
  { rank: 9, name: "DAO_Voter", xp: 19400, badges: 6, winRate: 75 },
  { rank: 10, name: "RuneReader", xp: 16200, badges: 5, winRate: 72 },
];

export const getLeaderboard = createServerFn({ method: "GET" })
  .inputValidator(z.object({
    limit: z.number().min(1).max(100).default(10),
    offset: z.number().min(0).default(0),
  }))
  .handler(async ({ data }) => {
    const sliced = LEADERBOARD_DATA.slice(data.offset, data.offset + data.limit);
    return { success: true, data: sliced, total: LEADERBOARD_DATA.length };
  });

// ─── Referral API ──────────────────────────────────────────────────
// In production, store in database
const referrals = new Map<string, { code: string; referrals: number; bonusXp: number }>();

export const createReferral = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    userId: z.string(),
    code: z.string().min(4).max(20),
  }))
  .handler(async ({ data }) => {
    referrals.set(data.userId, { code: data.code, referrals: 0, bonusXp: 0 });
    return { success: true, data: { code: data.code } };
  });

export const getReferral = createServerFn({ method: "GET" })
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    const ref = referrals.get(data.userId) || { code: data.userId.slice(0, 8).toUpperCase(), referrals: 0, bonusXp: 0 };
    return { success: true, data: ref };
  });
