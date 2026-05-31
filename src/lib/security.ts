// ─── Security Center ────────────────────────────────────────────────
// Token safety, wallet risk, and contract analysis
// Free APIs: GoPlus (token security), RugCheck (Solana token verification)

// ─── GoPlus Token Security API ──────────────────────────────────────
const GOPLUS_BASE = "https://api.gopluslabs.io/api/v1";

export interface TokenSecurity {
  address: string;
  name: string;
  symbol: string;
  isHoneypot: boolean;
  isMintable: boolean;
  isBlacklisted: boolean;
  isProxy: boolean;
  isBuyTax: boolean;
  buyTax?: number;
  sellTax?: number;
  ownerCanMint: boolean;
  hiddenOwner: boolean;
  canTakeBackOwnership: boolean;
  cannotSellAll: boolean;
  cannotBuy: boolean;
  tradingCooldown: boolean;
  riskScore: number; // 0-100
  riskLevel: "low" | "medium" | "high" | "critical";
  warnings: string[];
  holders: number;
  liquidityLocked: boolean;
  ownershipRenounced: boolean;
  createdAt?: number;
}

export async function getTokenSecurity(
  tokenAddress: string,
  chain: "solana" | "ethereum" | "bnb" | "base" = "solana"
): Promise<TokenSecurity | null> {
  const chainId = { solana: "501", ethereum: "1", bnb: "56", base: "8453" }[chain];

  try {
    const res = await fetch(`${GOPLUS_BASE}/token_security/${chainId}?contract_addresses=${tokenAddress}`);
    if (!res.ok) throw new Error(`GoPlus ${res.status}`);
    const data = await res.json();
    const result = data.result?.[tokenAddress.toLowerCase()];

    if (!result) return null;

    // Calculate risk score (0-100, higher = riskier)
    let riskScore = 0;
    const warnings: string[] = [];

    if (result.is_honeypot === "1") { riskScore += 40; warnings.push("🚨 Honeypot detected — cannot sell tokens"); }
    if (result.is_mintable === "1") { riskScore += 15; warnings.push("⚠️ Token is mintable by owner"); }
    if (result.is_blacklisted === "1") { riskScore += 30; warnings.push("⚠️ Has blacklist function"); }
    if (result.cannot_sell_all === "1") { riskScore += 25; warnings.push("⚠️ Cannot sell all tokens at once"); }
    if (result.trade_cooldown === "1") { riskScore += 10; warnings.push("⚠️ Has trading cooldown"); }
    if (result.hidden_owner === "1") { riskScore += 10; warnings.push("⚠️ Hidden owner address"); }
    if (result.can_take_back_ownership === "1") { riskScore += 10; warnings.push("⚠️ Owner can reclaim ownership"); }
    if (result.is_proxy === "1") { riskScore += 5; warnings.push("ℹ️ Uses proxy contract"); }

    const buy_tax = parseFloat(result.buy_tax || "0") * 100;
    const sell_tax = parseFloat(result.sell_tax || "0") * 100;
    if (buy_tax > 10) { riskScore += 10; warnings.push(`⚠️ High buy tax: ${buy_tax.toFixed(1)}%`); }
    if (sell_tax > 10) { riskScore += 10; warnings.push(`⚠️ High sell tax: ${sell_tax.toFixed(1)}%`); }

    const riskLevel: TokenSecurity["riskLevel"] =
      riskScore >= 60 ? "critical" : riskScore >= 40 ? "high" : riskScore >= 20 ? "medium" : "low";

    return {
      address: tokenAddress,
      name: result.name || "Unknown",
      symbol: result.symbol || "???",
      isHoneypot: result.is_honeypot === "1",
      isMintable: result.is_mintable === "1",
      isBlacklisted: result.is_blacklisted === "1",
      isProxy: result.is_proxy === "1",
      isBuyTax: parseFloat(result.buy_tax || "0") > 0,
      buyTax: buy_tax,
      sellTax: sell_tax,
      ownerCanMint: result.is_mintable === "1",
      hiddenOwner: result.hidden_owner === "1",
      canTakeBackOwnership: result.can_take_back_ownership === "1",
      cannotSellAll: result.cannot_sell_all === "1",
      cannotBuy: result.cannot_buy === "1",
      tradingCooldown: result.trade_cooldown === "1",
      riskScore: Math.min(riskScore, 100),
      riskLevel,
      warnings,
      holders: parseInt(result.holder_count || "0"),
      liquidityLocked: result.is_locked === "1",
      ownershipRenounced: result.owner_address === "0x0000000000000000000000000000000000000000" || !result.owner_address,
    };
  } catch {
    return null;
  }
}

// ─── RugCheck API (Solana-specific) ────────────────────────────────
const RUGCHECK_BASE = "https://api.rugcheck.xyz/v1";

export interface RugCheckResult {
  address: string;
  programId: string;
  score: number; // 0-1000, higher = more risky
  risks: Array<{ name: string; description: string; level: "warn" | "danger" | "info"; score: number }>;
  tokenInfo: {
    name: string;
    symbol: string;
    supply: number;
    decimals: number;
    mintAuthority: string | null;
    freezeAuthority: string | null;
    mutable: boolean;
    verified: boolean;
  };
  markets: Array<{ pubkey: string; marketType: string }>;
  topHolders: Array<{ address: string; amount: number; pct: number }>;
  lpLocked: number; // percentage of LP locked
}

export async function getRugCheckReport(tokenAddress: string): Promise<RugCheckResult | null> {
  try {
    const res = await fetch(`${RUGCHECK_BASE}/tokens/${tokenAddress}/report`);
    if (!res.ok) throw new Error(`RugCheck ${res.status}`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function getRugCheckTrending(): Promise<
  Array<{ address: string; name: string; symbol: string; score: number }>
> {
  try {
    const res = await fetch(`${RUGCHECK_BASE}/stats/new_tokens`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// ─── Wallet Risk Assessment ────────────────────────────────────────
export interface WalletRisk {
  score: number; // 0-100
  level: "low" | "medium" | "high" | "critical";
  flags: Array<{ type: string; description: string; severity: "info" | "warn" | "danger" }>;
}

export async function assessWalletRisk(address: string): Promise<WalletRisk> {
  const flags: WalletRisk["flags"] = [];
  let score = 0;

  try {
    // Check if wallet has interacted with known risky contracts
    const conn = new (await import("@solana/web3.js")).Connection("https://api.mainnet-beta.solana.com");
    const pubkey = new (await import("@solana/web3.js")).PublicKey(address);

    // Get recent transactions to check for suspicious patterns
    const sigs = await conn.getSignaturesForAddress(pubkey, { limit: 50 });
    const recentTxCount = sigs.length;

    if (recentTxCount === 0) {
      flags.push({ type: "new_wallet", description: "New or inactive wallet", severity: "info" });
      score += 10;
    }

    if (recentTxCount > 40) {
      flags.push({ type: "high_activity", description: "Very high transaction activity", severity: "warn" });
      score += 15;
    }

    // Check SOL balance
    const balance = await conn.getBalance(pubkey);
    const solBal = balance / 1e9;

    if (solBal < 0.01 && recentTxCount > 5) {
      flags.push({ type: "low_balance", description: "Very low SOL balance for activity level", severity: "warn" });
      score += 20;
    }

    if (solBal > 10000) {
      flags.push({ type: "whale", description: "Whale wallet (>10K SOL)", severity: "info" });
    }

    const level: WalletRisk["level"] =
      score >= 60 ? "critical" : score >= 40 ? "high" : score >= 20 ? "medium" : "low";

    return { score: Math.min(score, 100), level, flags };
  } catch {
    return { score: 0, level: "low", flags: [{ type: "unknown", description: "Could not assess wallet", severity: "info" }] };
  }
}

// ─── Contract Verifier ─────────────────────────────────────────────
export async function verifyContract(
  address: string,
  chain: string
): Promise<{
  verified: boolean;
  name?: string;
  compiler?: string;
  sourceCode?: string;
  abi?: any[];
}> {
  try {
    if (chain === "ethereum") {
      const res = await fetch(
        `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}`
      );
      const data = await res.json();
      const result = data.result?.[0];
      if (result && result.SourceCode) {
        return {
          verified: true,
          name: result.ContractName,
          compiler: result.CompilerVersion,
        };
      }
    }

    if (chain === "solana") {
      // Check if it's a known program
      const conn = new (await import("@solana/web3.js")).Connection("https://api.mainnet-beta.solana.com");
      const accountInfo = await conn.getAccountInfo(new (await import("@solana/web3.js")).PublicKey(address));
      if (accountInfo) {
        const owner = accountInfo.owner.toBase58();
        const knownPrograms: Record<string, string> = {
          "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA": "SPL Token Program",
          "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4": "Jupiter Aggregator",
          "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc": "Orca Whirlpool",
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": "Raydium AMM",
          "LockrTvtYNG7534XZkS1e53GJW5y4CEh4Ghfq2TvqjD": "Sablier Lockup",
        };
        const name = knownPrograms[owner];
        if (name) {
          return { verified: true, name };
        }
        return { verified: false, name: `Owner: ${owner.slice(0, 8)}…` };
      }
    }

    return { verified: false };
  } catch {
    return { verified: false };
  }
}
