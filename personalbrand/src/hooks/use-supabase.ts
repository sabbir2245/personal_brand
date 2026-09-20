"use client";

import { useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@/lib/supabase/client";

/**
 * Returns a memoized Supabase browser client authenticated with the Clerk
 * session JWT (issued from the "supabase" Clerk template), so RLS sees the
 * admin's `auth.uid()`.
 */
export function useSupabase(): SupabaseClient {
  const { getToken } = useAuth();

  return useMemo(
    () =>
      createBrowserClient(() =>
        getToken({ template: "supabase" }).then((t) => t ?? null),
      ),
    [getToken],
  );
}