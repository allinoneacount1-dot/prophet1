import { StatCard } from "@/components/app/StatCard";
import { usePortfolio } from "@/lib/usePortfolio";
import { fmtUsd } from "@/lib/mock";

export function PortfolioStats() {
  const { portfolio, pnl, staked, yieldEarned } = usePortfolio();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Portfolio"
        value={fmtUsd(portfolio)}
        delta={{ value: "+4.2%", positive: true }}
        icon={<WalletIcon className="h-4 w-4" />}
      />
      <StatCard
        label="PnL · 24h"
        value={fmtUsd(pnl)}
        delta={{ value: "+1.8%", positive: true }}
        icon={<Activity className="h-4 w-4" />}
      />
      <StatCard
        label="Total Staked"
        value={fmtUsd(staked)}
        delta={{ value: "+0.4%", positive: true }}
        icon={<Brain className="h-4 w-4" />}
      />
      <StatCard
        label="Yield Earned · 24h"
        value={fmtUsd(yieldEarned)}
        delta={{ value: "+12.1%", positive: true }}
        icon={<Sparkles className="h-4 w-4" />}
      />
    </div>
  );
}

function WalletIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h3.75a2.25 2.25 0 002.25-2.25V6.75m-15 0A2.25 2.25 0 014.5 4.5h13.5A2.25 2.25 0 0120.25 6.75v11.25a9 9 0 01-9 9h-3.75a9 9 0 01-9-9V6.75z"/></svg>
}
function Activity() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 0l6 6m-6-6l6-6"/></svg>
}
function Brain() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.984 15.003a9 9 0 01-4.216-2.103l-1.359-1.359a1 1 0 00-1.414-.146l-1.293.929a1 1 0 00-.324 1.414l-.929 1.293a1 1 0 00-.146 1.414A9 9 0 1121.083 9a9 9 0 01-1.099 6.003z"/></svg>
}
function Sparkles() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M11.49 3.75c1.048-.05 2.127.193 3.038.562l1.17.328a3 3 0 101.542-2.94l-1.17-.328a3.001 3.001 0 00-5.483.562l-1.17.328a3 3 0 10-1.542 2.94l1.17-.328zM5.25 18.75c1.048-.05 2.127.193 3.038.562l1.17.328a3 3 0 101.542-2.94l-1.17-.328a3.001 3.001 0 00-5.483.562l-1.17.328a3 3 0 10-1.542 2.94l1.17-.328zm12.75 0c1.048-.05 2.127.193 3.038.562l1.17.328a3 3 0 101.542-2.94l-1.17-.328a3.001 3.001 0 00-5.483.562l-1.17.328a3 3 0 10-1.542 2.94l1.17-.328z"/></svg>
}