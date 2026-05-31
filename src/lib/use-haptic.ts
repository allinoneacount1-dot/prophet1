// ─── Telegram Haptic Feedback Hook ─────────────────────────────────
// Lightweight wrapper for Telegram WebApp haptics — SSR-safe

type HapticStyle = "light" | "medium" | "heavy";
type HapticNotification = "error" | "success" | "warning";

export function haptic(style: HapticStyle = "medium") {
  try {
    (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred?.(style);
  } catch {}
}

export function hapticNotify(type: HapticNotification = "success") {
  try {
    (window as any).Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.(type);
  } catch {}
}

export function hapticSelection() {
  try {
    (window as any).Telegram?.WebApp?.HapticFeedback?.selectionChanged?.();
  } catch {}
}

/**
 * useHaptic — React helper that maps UI interactions to Telegram haptics
 * Call once at app root; returns trigger functions for components to use.
 *
 * Usage:
 *   const { onPress, onConfirm, onSwipe } = useHaptic();
 *   <button onClick={() => { onPress(); doThing() }}>Click</button>
 */
export function useHaptic() {
  return {
    onPress: (style: HapticStyle = "light") => () => haptic(style),
    onConfirm: () => () => hapticNotify("success"),
    onFail: () => () => hapticNotify("error"),
    onWarn: () => () => hapticNotify("warning"),
    onSelect: () => () => hapticSelection(),
  };
}
