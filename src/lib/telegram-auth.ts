// ─── Telegram Authentication ────────────────────────────────────────
// Browser: extractTelegramUser, verifyInitDataBrowser (Web Crypto API)
// Server: verifyTelegramInitData (Node.js crypto)
// Reference: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app

// Server-side verification (Node.js only — not for browser bundle)
export function verifyTelegramInitData(
  initData: string,
  botToken: string
): Record<string, any> | null {
  try {
    // Dynamic import to avoid bundling Node crypto in browser
    const { createHmac } = require("crypto");
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash) return null;

    const dataCheckString = Array.from(params.entries())
      .filter(([key]) => key !== "hash")
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
    const calculatedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

    if (calculatedHash !== hash) return null;
    const user = params.get("user");
    return user ? JSON.parse(decodeURIComponent(user)) : null;
  } catch {
    return null;
  }
}

/**
 * Extract user data from Telegram WebApp (client-side, unverified)
 * Server MUST verify via HMAC-SHA256 before trusting
 */
export function extractTelegramUser(): {
  isTMA: boolean;
  initData: string;
  user: Record<string, any> | null;
  authDate: number;
  queryId: string;
} {
  try {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg?.initData) {
      return { isTMA: false, initData: "", user: null, authDate: 0, queryId: "" };
    }

    const params = new URLSearchParams(tg.initData);
    return {
      isTMA: true,
      initData: tg.initData,
      user: tg.initDataUnsafe?.user || null,
      authDate: parseInt(params.get("auth_date") || "0"),
      queryId: params.get("query_id") || "",
    };
  } catch {
    return { isTMA: false, initData: "", user: null, authDate: 0, queryId: "" };
  }
}

/**
 * Check if initData is expired (default 24h max age)
 */
export function isInitDataExpired(authDate: number, maxAgeHours = 24): boolean {
  if (!authDate) return true;
  const now = Math.floor(Date.now() / 1000);
  return now - authDate > maxAgeHours * 3600;
}

/**
 * Verify Telegram initData using Web Crypto API (browser-compatible)
 * This runs client-side for quick checks — server should also verify
 */
export async function verifyInitDataBrowser(
  initData: string,
  botToken: string
): Promise<boolean> {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash) return false;

    const dataCheckString = Array.from(params.entries())
      .filter(([key]) => key !== "hash")
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    const encoder = new TextEncoder();
    const webCrypto = (globalThis as any).crypto;

    const botTokenKey = await webCrypto.subtle.importKey(
      "raw",
      encoder.encode("WebAppData"),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const secretKeyBuffer = await webCrypto.subtle.sign("HMAC", botTokenKey, encoder.encode(botToken));
    const secretKey = await webCrypto.subtle.importKey(
      "raw",
      secretKeyBuffer,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await webCrypto.subtle.sign("HMAC", secretKey, encoder.encode(dataCheckString));
    const calculatedHash = Array.from(new Uint8Array(signature))
      .map((b: number) => b.toString(16).padStart(2, "0"))
      .join("");

    return calculatedHash === hash;
  } catch {
    return false;
  }
}
