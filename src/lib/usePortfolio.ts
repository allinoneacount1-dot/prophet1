import { useLivePrice } from "./mock";
import { CHAINS } from "./chain";

export function usePortfolio() {
  // Base values (mock) - in real app these would come from API or wallet
  const basePortfolio = useLivePrice(184_320, 0.004);
  const basePNL = useLivePrice(2_840, 0.01);
  const baseStaked = useLivePrice(48_120, 0.003);
  const baseYield = useLivePrice(312, 0.01);

  // Calculate per-chain allocation (mock formula)
  const chainAllocations = CHAINS.map(chain => ({
    id: chain.id,
    label: chain.label,
    color: chain.color,
    value: basePortfolio * (0.15 + (chain.id.length % 4) * 0.15),
  }));

  return {
    portfolio: basePortfolio,
    pnl: basePNL,
    staked: baseStaked,
    yieldEarned: baseYield,
    chainAllocations,
  };
}