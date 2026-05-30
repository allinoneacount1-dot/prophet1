import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Brain,
  Users,
  Coins,
  Vote,
  Network,
  Flame,
  Send,
  Gamepad2,
  BookOpen,
  ArrowLeftRight,
  ShieldCheck,
  BarChart3,
  MessageSquare,
  CreditCard,
  Settings,
  Bell,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BuyProphetButton } from "./BuyProphetButton";

const sections = [
  {
    label: "Core",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/deai", label: "DeAI Hub", icon: Brain },
      { to: "/copilot", label: "AI Copilot", icon: MessageSquare },
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "DeFi",
    items: [
      { to: "/staking", label: "Staking & Yield", icon: Coins },
      { to: "/bridge", label: "Bridge", icon: ArrowLeftRight },
      { to: "/tokenomics", label: "Tokenomics", icon: Flame },
      { to: "/pricing", label: "Pricing Tiers", icon: CreditCard },
    ],
  },
  {
    label: "Community",
    items: [
      { to: "/socialfi", label: "SocialFi", icon: Users },
      { to: "/governance", label: "Governance", icon: Vote },
      { to: "/arcade", label: "Arcade", icon: Gamepad2 },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { to: "/depin", label: "DePIN", icon: Network },
      { to: "/tma", label: "Telegram Mini App", icon: Send },
      { to: "/security", label: "Security Center", icon: ShieldCheck },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/profile", label: "Profile", icon: UserCircle2 },
      { to: "/notifications", label: "Notifications", icon: Bell },
      { to: "/settings", label: "Settings", icon: Settings },
      { to: "/docs", label: "Docs", icon: BookOpen },
    ],
  },
] as const;

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="flex h-full w-72 flex-col border-r border-border bg-sidebar/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 rounded-lg bg-[linear-gradient(135deg,var(--prophet),var(--chain))] chain-glow">
            <div className="absolute inset-1 rounded-md bg-background/40 backdrop-blur" />
            <div className="absolute inset-0 grid place-items-center text-xs font-black text-primary-foreground">
              Ψ
            </div>
          </div>
          <div>
            <div className="text-sm font-bold leading-none">ProphetSol</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Wealth OS
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
        {sections.map((sec) => (
          <div key={sec.label} className="mb-5">
            <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {sec.label}
            </div>
            <ul className="space-y-0.5">
              {sec.items.map((it) => {
                const active = pathname === it.to;
                const Icon = it.icon;
                return (
                  <li key={it.to}>
                    <Link
                      to={it.to}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                        active
                          ? "bg-[color:var(--chain)]/10 text-foreground"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          active
                            ? "text-[color:var(--chain)]"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                      <span className="flex-1">{it.label}</span>
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--chain)] chain-glow" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <BuyProphetButton className="w-full justify-center" />
        <p className="mt-3 text-center text-[10px] text-muted-foreground">
          v2.0 · Multi-Chain · AI · DePIN
        </p>
      </div>
    </aside>
  );
}