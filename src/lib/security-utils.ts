// ─── Security & Input Validation Utilities ──────────────────────────
// Centralized validation, sanitization, and security helpers

/**
 * Validate a Solana address (base58, 32-44 chars)
 */
export function isValidSolanaAddress(address: string): boolean {
  if (!address || typeof address !== "string") return false;
  if (address.length < 32 || address.length > 44) return false;
  // Base58 alphabet: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
  return /^[1-9A-HJ-NP-Za-km-z]+$/.test(address);
}

/**
 * Validate an Ethereum address (0x + 40 hex chars)
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate a token amount (positive number, reasonable range)
 */
export function validateAmount(amount: string, max = 1e12): { valid: boolean; value: number; error?: string } {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return { valid: false, value: 0, error: "Enter a positive amount" };
  if (num > max) return { valid: false, value: 0, error: `Amount too large (max ${max})` };
  if (!isFinite(num)) return { valid: false, value: 0, error: "Invalid amount" };
  return { valid: true, value: num };
}

/**
 * Safe localStorage wrapper with SSR guard
 */
export const safeStorage = {
  get(key: string): string | null {
    try {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): boolean {
    try {
      if (typeof window === "undefined") return false;
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  remove(key: string): boolean {
    try {
      if (typeof window === "undefined") return false;
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  getJSON<T>(key: string, fallback: T): T {
    const raw = this.get(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  setJSON(key: string, value: unknown): boolean {
    try {
      return this.set(key, JSON.stringify(value));
    } catch {
      return false;
    }
  },
};

/**
 * Rate limiter for API calls (client-side)
 */
export class RateLimiter {
  private timestamps: number[] = [];

  constructor(private maxCalls: number, private windowMs: number) {}

  canCall(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);
    if (this.timestamps.length >= this.maxCalls) return false;
    this.timestamps.push(now);
    return true;
  }

  get remaining(): number {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);
    return Math.max(0, this.maxCalls - this.timestamps.length);
  }
}

/**
 * CSP nonce generator (for server-side rendering)
 */
export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}
