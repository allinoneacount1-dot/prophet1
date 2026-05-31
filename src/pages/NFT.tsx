// ─── NFT Marketplace ────────────────────────────────────────────────
// Browse, buy, sell NFTs on Solana via Helius DAS API

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useNativeWallet } from "@/lib/use-native-wallet";
import { useQuery } from "@tanstack/react-query";
import { Search, Grid3X3, List, TrendingUp, Tag, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/nft")({
  head: () => ({ meta: [{ title: "NFT Marketplace — Prophet" }] }),
  component: NFTPage,
});

interface NFTItem {
  mint: string;
  name: string;
  image: string;
  collection: string;
  price: number;
  lastSale: number;
  owner: string;
}

// Mock trending collections (replace with Helius API)
const TRENDING: NFTItem[] = [
  { mint: "1", name: "Okay Bears #1234", image: "🐻", collection: "Okay Bears", price: 45.5, lastSale: 42.0, owner: "..." },
  { mint: "2", name: "DeGods #5678", image: "💀", collection: "DeGods", price: 120.0, lastSale: 115.0, owner: "..." },
  { mint: "3", name: "Claynosaurz #9012", image: "🦕", collection: "Claynosaurz", price: 38.2, lastSale: 35.0, owner: "..." },
  { mint: "4", name: "Sols #3456", image: "◎", collection: "Sols", price: 85.0, lastSale: 80.0, owner: "..." },
  { mint: "5", name: "Cets #7890", image: "🐱", collection: "Cets on Crable", price: 55.3, lastSale: 50.0, owner: "..." },
  { mint: "6", name: "Ape #2345", image: "🦍", collection: "Solana Monkey Business", price: 28.7, lastSale: 25.0, owner: "..." },
];

type SortKey = "price_asc" | "price_desc" | "recent" | "trending";

function NFTPage() {
  const { connected } = useNativeWallet();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<SortKey>("trending");
  const [search, setSearch] = useState("");

  const filtered = TRENDING.filter(
    (n) =>
      n.name.toLowerCase().includes(search.toLowerCase()) ||
      n.collection.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">🖼️ NFT Marketplace</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse Solana NFTs</p>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or collection..."
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-sm outline-none focus:border-[#14F195]/50"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none"
          style={{ color: "#fff" }}
        >
          <option value="trending">Trending</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="recent">Recently Listed</option>
        </select>
        <div className="flex rounded-xl border border-white/10 overflow-hidden">
          <button onClick={() => setView("grid")} className={`p-3 ${view === "grid" ? "bg-[#14F195]/10 text-[#14F195]" : "bg-white/5 text-muted-foreground"}`}>
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button onClick={() => setView("list")} className={`p-3 ${view === "list" ? "bg-[#14F195]/10 text-[#14F195]" : "bg-white/5 text-muted-foreground"}`}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Trending Collections */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {["🐻 Okay Bears", "💀 DeGods", "🦕 Claynosaurz", "◎ Sols", "🐱 Cets", "🦍 SMB"].map((c) => {
          const [emoji, ...nameParts] = c.split(" ");
          return (
            <button key={c} className="rounded-xl p-3 text-center hover:bg-white/5 transition-colors" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="text-xs font-medium truncate">{nameParts.join(" ")}</div>
            </button>
          );
        })}
      </div>

      {/* NFT Grid */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((nft) => (
            <div key={nft.mint} className="rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="aspect-square flex items-center justify-center text-6xl" style={{ background: "linear-gradient(135deg, rgba(20,241,149,0.05), rgba(153,69,255,0.05))" }}>
                {nft.image}
              </div>
              <div className="p-3 space-y-1">
                <div className="text-sm font-medium truncate">{nft.name}</div>
                <div className="text-[10px] text-muted-foreground">{nft.collection}</div>
                <div className="flex items-center justify-between pt-1">
                  <div className="text-sm font-bold text-[#14F195]">◎{nft.price}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +{((nft.price - nft.lastSale) / nft.lastSale * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((nft) => (
            <div key={nft.mint} className="flex items-center gap-4 rounded-xl p-3 hover:bg-white/5 cursor-pointer" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="h-14 w-14 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: "linear-gradient(135deg, rgba(20,241,149,0.05), rgba(153,69,255,0.05))" }}>
                {nft.image}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{nft.name}</div>
                <div className="text-xs text-muted-foreground">{nft.collection}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-[#14F195]">◎{nft.price}</div>
                <div className="text-[10px] text-muted-foreground">Last: ◎{nft.lastSale}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center text-xs text-muted-foreground py-4">
        Powered by Helius DAS API · Prophet Marketplace v1.0
      </div>
    </div>
  );
}
