import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Menu, Search, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { useTicker, randomActivity } from "@/lib/mock";

// ─── SSR-safe wrapper: only renders on client ─────────────────────
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useState(() => setMounted(true));
  if (!mounted) return null;
  return <>{children}</>;
}

export function Topbar({ onMenu }: { onMenu?: () => void }) {
  const [q, setQ] = useState("");
  const tick = useTicker(3000);

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

      {/* Chain selector & notifications — client-only to avoid SSR HTMLElement issues */}
      <ClientOnly>
        <ChainSelector />
        <NotificationPopover />
      </ClientOnly>

      <ConnectWallet />

      <div className="hidden lg:block">
        <BuyProphetButton />
      </div>
    </header>
  );
}

function ChainSelector() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-1/60 px-3 py-2 text-xs font-medium hover:bg-white/5"
      >
        <span className="h-2 w-2 rounded-full chain-glow" style={{ background: "var(--chain)" }} />
        <span className="hidden sm:inline">Chain</span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-surface-1 shadow-xl">
          {["solana", "base", "bnb", "ethereum"].map((c) => (
            <button key={c} className="block w-full px-3 py-2 text-left text-xs hover:bg-white/5">
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const tick = useTicker(3000);
  const notifs = Array.from({ length: 6 }, (_, i) => randomActivity(tick + i * 13));
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface-1/60 hover:bg-white/5"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[color:var(--chain)] chain-glow" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-surface-1 shadow-xl">
          <div className="border-b border-border px-4 py-3">
            <div className="text-sm font-semibold">Notifications</div>
          </div>
          <ul className="max-h-80 divide-y divide-border overflow-y-auto">
            {notifs.map((n, i) => (
              <li key={i} className="flex items-start gap-3 px-4 py-3 text-xs">
                <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--chain)] chain-glow" />
                <div className="flex-1">
                  <div className="text-foreground">
                    Signal: <b>{n.token}</b> +{n.amount}%
                  </div>
                  <div className="text-muted-foreground">{i + 1}m ago</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Stub — replaced by dynamic import in AppShell
function BuyProphetButton() {
  return <button className="rounded-lg bg-[color:var(--chain)] px-3 py-2 text-xs font-medium">Buy $PROPHET</button>;
}

function ConnectWallet() {
  return <button className="rounded-lg border border-border bg-surface-1/60 px-3 py-2 text-xs hover:bg-white/5">Connect</button>;
}