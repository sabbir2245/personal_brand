"use client";

import { useEffect } from "react";

type CalApi = {
  (fn: "init"): void;
  (fn: "ui", action: string, payload: unknown): void;
  loaded?: boolean;
  ns?: Record<string, unknown>;
  q?: unknown[];
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

export const CAL_LINK = "robin-son-s7mo7q";

export function CalEmbed() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Cal?.loaded) return;

    (function (C: Window, A: string, L: string) {
      const d = C.document;
      const cal = function (...args: unknown[]) {
        const c = C.Cal as CalApi & { loaded: boolean; q: unknown[] };
        if (!c.loaded) {
          c.ns = c.ns || {};
          c.q = c.q || [];
          const s = d.createElement("script");
          s.src = A;
          d.head.appendChild(s);
          c.loaded = true;
        }
        if (args[0] === L) {
          const namespace = args[1] as string;
          const api = function (...a: unknown[]) {
            api.q.push(a);
          } as ((...a: unknown[]) => void) & { q: unknown[] };
          api.q = [];
          c.ns![namespace] = api;
          api(...args.slice(2));
        } else if (c.q) {
          c.q.push(args);
        }
      };
      C.Cal = cal as CalApi;
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal?.("init");
    window.Cal?.("ui", "", {
      theme: "auto",
      cssVarsPerTheme: { dark: { "cal-brand": "#0052ff" }, light: { "cal-brand": "#0052ff" } },
    });
  }, []);

  return null;
}
