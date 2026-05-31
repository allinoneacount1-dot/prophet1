// ─── On-chain data layer ────────────────────────────────────────────
// Free APIs: Helius (Solana RPC), CoinGecko (prices), Li.Fi (bridge)
// No API keys needed for basic usage (public endpoints + free tiers)

// ─── Token mint addresses (mainnet) ────────────────────────────────
export const TOKEN_MINTS: Record<string, string> = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  JUP: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  WIF: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
  BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  PROPHET: "", // Not launched yet — placeholder
};

// ─── Chain explorers ───────────────────────────────────────────────
export const EXPLORERS: Record<string, string> = {
  solana: "https://solscan.io/account/",
  ethereum: "https://etherscan.io/address/",
  bnb: "https://bscscan.com/address/",
  base: "https://basescan.org/address/",
};

// ─── Solana RPC (Helius free tier — no key needed for basic) ────────
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

export async function fetchSolBalance(address: string): Promise<number> {
  try {
    const res = await fetch(SOLANA_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [address],
      }),
    });
    const data = await res.json();
    if (data.result) {
      return data.result.value / 1e9; // lamports → SOL
    }
    return 0;
  } catch {
    return 0;
  }
}

export async function fetchSolTokenBalances(address: string): Promise<
  Array<{ mint: string; symbol: string; amount: number; decimals: number }>
> {
  try {
    // Use Helius RPC for token accounts (free, no key for basic)
    const res = await fetch(SOLANA_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountsByOwner",
        params: [
          address,
          { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
          { encoding: "jsonParsed" },
        ],
      }),
    });
    const data = await res.json();
    if (!data.result?.value) return [];

    return data.result.value
      .map((acc: any) => {
        const info = acc.account.data.parsed.info;
        const mint = info.mint;
        const amount = info.tokenAmount.uiAmount || 0;
        const decimals = info.tokenAmount.decimals || 0;
        const symbol = TOKEN_MINTS[mint] ? mint : mint.slice(0, 4);
        return { mint, symbol, amount, decimals };
      })
      .filter((t: any) => t.amount > 0);
  } catch {
    return [];
  }
}

// ─── CoinGecko Price API (free, no key) ────────────────────────────
const CG_BASE = "https://api.coingecko.com/api/v3";

export interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
}

const CG_IDS: Record<string, string> = {
  SOL: "solana",
  ETH: "ethereum",
  BNB: "binancecoin",
  USDC: "usd-coin",
  JUP: "jupiter-exchange-solana",
  WIF: "dogwifhat",
  BONK: "bonk",
  PROPHET: "", // Not listed yet
};

export async function fetchTokenPrices(symbols: string[]): Promise<TokenPrice[]> {
  const ids = symbols
    .map((s) => CG_IDS[s.toUpperCase()])
    .filter(Boolean)
    .join(",");

  if (!ids.length) return [];

  try {
    const res = await fetch(
      `${CG_BASE}/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const data = await res.json();

    return data.map((c: any) => ({
      symbol: Object.entries(CG_IDS).find(([, v]) => v === c.id)?.[0] || c.symbol.toUpperCase(),
      price: c.current_price || 0,
      change24h: c.price_change_percentage_24h || 0,
      marketCap: c.market_cap || 0,
    }));
  } catch {
    return [];
  }
}

export async function fetchSinglePrice(symbol: string): Promise<number> {
  const id = CG_IDS[symbol.toUpperCase()];
  if (!id) return 0;
  try {
    const res = await fetch(
      `${CG_BASE}/simple/price?ids=${id}&vs_currencies=usd`
    );
    const data = await res.json();
    return data[id]?.usd || 0;
  } catch {
    return 0;
  }
}

// ─── Portfolio aggregation ─────────────────────────────────────────
export interface PortfolioData {
  totalValue: number;
  solBalance: number;
  tokenBalances: Array<{ symbol: string; amount: number; value: number; price: number }>;
  chainBreakdown: Array<{ chain: string; value: number; color: string }>;
  prices: TokenPrice[];
}

export async function fetchPortfolio(address: string): Promise<PortfolioData> {
  const [solBal, tokenAccs, prices] = await Promise.all([
    fetchSolBalance(address),
    fetchSolTokenBalances(address),
    fetchTokenPrices(["SOL", "ETH", "BNB", "USDC", "JUP", "WIF", "BONK"]),
  ]);

  const priceMap = new Map(prices.map((p) => [p.symbol.toUpperCase(), p.price]));
  const solPrice = priceMap.get("SOL") || 0;

  // Calculate token values
  const tokenBalances = tokenAccs.map((t) => {
    const sym = Object.entries(TOKEN_MINTS).find(
      ([, mint]) => mint === t.mint
    );
    const symbol = sym ? sym[0] : t.mint.slice(0, 6);
    const price = priceMap.get(symbol.toUpperCase()) || 0;
    return {
      symbol,
      amount: t.amount,
      price,
      value: t.amount * price,
    };
  });

  const solValue = solBal * solPrice;
  const tokensValue = tokenBalances.reduce((s, t) => s + t.value, 0);
  const totalValue = solValue + tokensValue;

  // Chain breakdown (simplified — all on Solana for now)
  const chainBreakdown = [
    { chain: "Solana", value: totalValue, color: "#14F195" },
    { chain: "Ethereum", value: 0, color: "#8A92B2" },
    { chain: "BNB", value: 0, color: "#F0B90B" },
    { chain: "Base", value: 0, color: "#0052FF" },
  ];

  return {
    totalValue,
    solBalance: solBal,
    tokenBalances,
    chainBreakdown,
    prices,
  };
}

// ─── Jupiter Swap API (free, no key) ───────────────────────────────
export interface JupiterQuote {
  inAmount: number;
  outAmount: number;
  priceImpactPct: number;
  routePlan: Array<{ swapInfo: { label: string } }>;
  slippageBps: number;
}

const JUP_BASE = "https://quote-api.jup.ag/v6";

export async function fetchJupiterQuote(
  inputMint: string,
  outputMint: string,
  amountInSmallestUnit: number,
  slippageBps = 50
): Promise<JupiterQuote | null> {
  try {
    const url = `${JUP_BASE}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountInSmallestUnit}&slippageBps=${slippageBps}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      inAmount: data.inAmount,
      outAmount: data.outAmount,
      priceImpactPct: data.priceImpactPct || 0,
      routePlan: data.routePlan || [],
      slippageBps,
    };
  } catch {
    return null;
  }
}

// ─── Li.Fi Bridge API (free, no key) ───────────────────────────────
const LIFI_BASE = "https://li.quest/v1";

export interface BridgeQuote {
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  estimatedGas: number;
  estimatedTime: number; // seconds
  steps: Array<{ tool: string; fromChainId: number; toChainId: number }>;
}

export async function fetchLiFiQuote(
  fromChain: string,
  toChain: string,
  fromToken: string,
  toToken: string,
  fromAmount: number
): Promise<BridgeQuote | null> {
  try {
    // Map chain names to Li.Fi chain IDs
    const chainIds: Record<string, number> = {
      solana: 1151111081099710,
      ethereum: 1,
      bnb: 56,
      base: 8453,
    };

    const fromChainId = chainIds[fromChain];
    const toChainId = chainIds[toChain];
    if (!fromChainId || !toChainId) return null;

    const url = `${LIFI_BASE}/quote?fromChain=${fromChainId}&toChain=${toChainId}&fromToken=${fromToken}&toToken=${toToken}&fromAmount=${fromAmount}&fromAddress=0x0000000000000000000000000000000000000000`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    return {
      fromChain,
      toChain,
      fromToken,
      toToken,
      fromAmount,
      toAmount: data.estimate?.toAmount || 0,
      estimatedGas: data.estimate?.gasCosts?.[0]?.amount || 0,
      estimatedTime: data.estimate?.executionDuration || 0,
      steps: data.includedSteps || [],
    };
  } catch {
    return null;
  }
}

// ─── Helius Enhanced API (free tier) ───────────────────────────────
// For richer data: NFTs, transaction history, etc.
const HELIUS_BASE = "https://api.helius.xyz/v0";

export async function fetchWalletNFTs(
  address: string,
  apiKey?: string
): Promise<any[]> {
  if (!apiKey) return [];
  try {
    const res = await fetch(
      `${HELIUS_BASE}/addresses/${address}/nfts?api-key=${apiKey}`
    );
    const data = await res.json();
    return data.nfts || [];
  } catch {
    return [];
  }
}

export async function fetchTransactionHistory(
  address: string,
  apiKey?: string
): Promise<any[]> {
  if (!apiKey) return [];
  try {
    const res = await fetch(
      `${HELIUS_BASE}/addresses/${address}/transactions?api-key=${apiKey}`
    );
    const data = await res.json();
    return data || [];
  } catch {
    return [];
  }
}
