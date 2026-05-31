// ─── Telegram Deeplink Handler ──────────────────────────────────────
// Parses TMA launch params and routes to the correct screen
//
// Supported deeplinks (via start_param or URL query):
//   swap       → Navigate to Swap tab
//   stake      → Navigate to Staking tab
//   portfolio  → Navigate to Portfolio tab
//   dashboard  → Navigate to Dashboard tab
//   price      → Show SOL price toast
//   ref=CODE   → Track referral

export type DeepLinkTarget = "home" | "swap" | "staking" | "dashboard" | "profile" | "price";

export interface DeepLinkData {
  target: DeepLinkTarget;
  ref: string | null;
  rawParam: string;
}

export function parseDeepLink(): DeepLinkData {
  try {
    // Method 1: Telegram start_param (deep link via bot)
    const tg = (window as any).Telegram?.WebApp;
    const startParam = tg?.initDataUnsafe?.start_param || "";

    // Method 2: URL query params
    const params = new URLSearchParams(window.location.search);
    const startapp = params.get("startapp") || "";
    const ref = params.get("ref");

    // Priority: startParam > startapp > none
    const rawParam = startParam || startapp;

    const targetMap: Record<string, DeepLinkTarget> = {
      swap: "swap",
      trade: "swap",
      exchange: "swap",
      stake: "staking",
      staking: "staking",
      portfolio: "dashboard",
      dashboard: "dashboard",
      wallet: "dashboard",
      me: "profile",
      account: "profile",
      price: "price",
    };

    return {
      target: targetMap[rawParam] || "home",
      ref,
      rawParam,
    };
  } catch {
    return { target: "home", ref: null, rawParam: "" };
  }
}

/**
 * Apply deeplink navigation to TMA tab state.
 * Returns the tab that should be active on first render.
 */
export function getInitialTab(): DeepLinkTarget {
  const link = parseDeepLink();
  return link.target;
}

/**
 * Track referral from URL — call once on TMA mount
 */
export function getReferralCode(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("ref");
  } catch {
    return null;
  }
}
