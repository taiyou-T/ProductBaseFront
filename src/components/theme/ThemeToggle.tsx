"use client";

import { useTheme, type Theme } from "@/components/theme/ThemeProvider";

const LABELS: Record<Theme, string> = {
  light: "ライト",
  dark: "ダーク",
  system: "システム",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    const order: Theme[] = ["light", "dark", "system"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      className="rounded-lg px-2 py-1 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      aria-label={`テーマ: ${LABELS[theme]}`}
      title={`テーマ: ${LABELS[theme]}`}
    >
      {theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "💻"}
    </button>
  );
}
