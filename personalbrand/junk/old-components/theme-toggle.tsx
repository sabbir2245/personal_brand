"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount flag to defer SSR/hydration mismatch
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
      title={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
      className="group relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] shadow-sm transition-all duration-200 hover:border-[rgba(0,82,255,0.4)] hover:text-[var(--accent)] hover:shadow-[var(--shadow-accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] dark:bg-[var(--muted)]"
    >
      {/* Sun icon (shown in dark mode to switch to light) */}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          mounted && isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
        }`}
        aria-hidden="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </span>

      {/* Moon icon (shown in light mode to switch to dark) */}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          mounted && !isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
        }`}
        aria-hidden="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </span>

      {/* Fallback icon before mount */}
      {!mounted && (
        <span className="h-4 w-4 rounded-full border-2 border-current opacity-40" aria-hidden="true" />
      )}
    </button>
  );
}