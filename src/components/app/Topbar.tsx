import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Menu, Search, ChevronDown, LogOut, Wallet } from "lucide-react";
import { CHAINS, useChain, shortAddr, WALLETS } from "@/lib/chain";
import { cn } from "@/lib/utils";
import { BuyProphetButton } from "./BuyProphetButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTicker, randomActivity } from "@/lib/mock";
import { toast } from "sonner";

export function Topbar({ onMenu }: { onMenu?: () => void }) {
  const { chain, setChain, wallet, address, connect, disconnect, connected } = useChain();
  const [q, setQ] = useState("");
  const tick = useTicker(3000);
  const notifs = Array.from({ length: 6 }, (_, i) => randomActivity(tick + i * 13));

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <button
        onClick={onMenu}
        className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-white/5 lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search wallet, token, proposal, node…"
          className="h-10 w-full rounded-lg border border-border bg-surface-1/60 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-[color:var(--chain)] focus:chain-glow"
        />
      </div>

      <div className="flex-1 md:hidden" />

      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-1/60 px-3 py-2 text-xs font-medium hover:bg-white/5">
          <span className="h-2 w-2 rounded-full chain-glow" style={{ background: "var(--chain)" }} />
          <span className="hidden sm:inline">{CHAINS.find((c) => c.id === chain)?.label}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Switch Network</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {CHAINS.map((c) => (
            <DropdownMenuItem key={c.id} onClick={() => setChain(c.id)} className="gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: c.color, boxShadow: `0 0 12px ${c.color}` }}
              />
              <span className="flex-1">{c.label}</span>
              {c.id === chain && <span className="text-[color:var(--chain)]">●</span>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover>
        <PopoverTrigger asChild>
          <button className="relative grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface-1/60 hover:bg-white/5">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[color:var(--chain)] chain-glow" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="border-b border-border px-4 py-3">
            <div className="text-sm font-semibold">DeAI Notifications</div>
            <div className="text-xs text-muted-foreground">Live feed · powered by AI</div>
          </div>
          <ul className="max-h-80 divide-y divide-border overflow-y-auto">
            {notifs.map((n, i) => (
              <li key={i} className="flex items-start gap-3 px-4 py-3 text-xs">
                <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--chain)] chain-glow" />
                <div className="flex-1">
                  <div className="text-foreground">
                    AI signal: <b>{n.token}</b> sentiment surged{" "}
                    <span className="text-[color:var(--success)]">+{n.amount}%</span>
                  </div>
                  <div className="text-muted-foreground">{i + 1}m ago · Solana cluster</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-border p-2">
            <Link
              to="/notifications"
              className="block rounded-md px-3 py-2 text-center text-xs hover:bg-white/5"
            >
              View all notifications →
            </Link>
          </div>
        </PopoverContent>
      </Popover>

      {connected ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--chain)]/40 bg-[color:var(--chain)]/10 px-3 py-2 text-xs font-medium">
            <Wallet className="h-3.5 w-3.5 text-[color:var(--chain)]" />
            <span className="hidden font-mono sm:inline">{shortAddr(address)}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="capitalize">{wallet} Wallet</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                disconnect();
                toast("Wallet disconnected");
              }}
              className="text-destructive"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" /> Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border border-border bg-surface-1/60 px-3 py-2 text-xs font-medium hover:bg-white/5",
            )}
          >
            <Wallet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Connect</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Choose wallet</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {WALLETS.map((w) => (
              <DropdownMenuItem
                key={w.id}
                onClick={() => {
                  connect(w.id);
                  toast.success(`${w.label} connected`);
                }}
              >
                {w.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div className="hidden lg:block">
        <BuyProphetButton size="sm" />
      </div>
    </header>
  );
}