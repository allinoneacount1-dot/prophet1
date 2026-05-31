// ─── Telegram Theme Sync ────────────────────────────────────────────
// Syncs app colors with Telegram's native theme
// Provides: themeParams, isDark, isInvertedColorScheme, all Telegram colors

import { useState, useEffect, useCallback } from "react";

export interface TelegramThemeParams {
  bg_color: string;
  text_color: string;
  hint_color: string;
  link_color: string;
  button_color: string;
  button_text_color: string;
  secondary_bg_color: string;
  header_bg_color: string;
  accent_text_color: string;
  section_bg_color: string;
  section_header_text_color: string;
  subtitle_text_color: string;
  destructive_text_color: string;
}

const DEFAULT_THEME: TelegramThemeParams = {
  bg_color: "#0a0a0f",
  text_color: "#ffffff",
  hint_color: "#6b7280",
  link_color: "#14F195",
  button_color: "#14F195",
  button_text_color: "#000000",
  secondary_bg_color: "#111118",
  header_bg_color: "#0a0a0f",
  accent_text_color: "#9945FF",
  section_bg_color: "#1a1a24",
  section_header_text_color: "#9ca3af",
  subtitle_text_color: "#6b7280",
  destructive_text_color: "#ef4444",
};

export function useTelegramTheme() {
  const [theme, setTheme] = useState<TelegramThemeParams>(DEFAULT_THEME);
  const [isTMA, setIsTMA] = useState(false);

  useEffect(() => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        setIsTMA(true);
        if (tg.themeParams) {
          setTheme({ ...DEFAULT_THEME, ...tg.themeParams });
        }
        // Listen for theme changes
        tg.onEvent("themeChanged", () => {
          if (tg.themeParams) setTheme({ ...DEFAULT_THEME, ...tg.themeParams });
        });
      }
    } catch {}
  }, []);

  const isDark = isTMA ? (theme.bg_color || "#000").replace("#", "").toLowerCase() < "888888" : true;

  // Generate CSS variables string for inline styles or CSS-in-JS
  const cssVars = useCallback(() => {
    return {
      "--tg-bg": theme.bg_color,
      "--tg-text": theme.text_color,
      "--tg-hint": theme.hint_color,
      "--tg-link": theme.link_color,
      "--tg-btn": theme.button_color,
      "--tg-btn-text": theme.button_text_color,
      "--tg-secondary": theme.secondary_bg_color,
      "--tg-header": theme.header_bg_color,
      "--tg-accent": theme.accent_text_color,
      "--tg-section": theme.section_bg_color,
      "--tg-section-header": theme.section_header_text_color,
      "--tg-subtitle": theme.subtitle_text_color,
      "--tg-danger": theme.destructive_text_color,
    } as React.CSSProperties;
  }, [theme]);

  return { theme, isTMA, isDark, cssVars };
}

/**
 * Returns inline style object with Telegram theme colors applied.
 * Usage: <div style={telegramBg()}>...</div>
 */
export function telegramBg(secondary = false): React.CSSProperties {
  try {
    const tg = (window as any).Telegram?.WebApp;
    return { backgroundColor: secondary ? tg?.themeParams?.secondary_bg_color : tg?.themeParams?.bg_color };
  } catch {
    return {};
  }
}
