export const SETTINGS_KEY = "expense-manager-settings";

export type Currency = "VND" | "USD";
export type Theme = "light" | "dark" | "system";
export type Language = "vi" | "en";

export interface AppSettings {
  currency: Currency;
  theme: Theme;
  language: Language;
  notifications: boolean;
  startOfWeek: 0 | 1; // 0 = Chủ nhật, 1 = Thứ hai
}

export const DEFAULT_SETTINGS: AppSettings = {
  currency: "VND",
  theme: "system",
  language: "vi",
  notifications: true,
  startOfWeek: 0,
};

export function getStoredSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(
    currency === "VND" ? "vi-VN" : "en-US",
    { style: "currency", currency }
  ).format(amount);
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
}
