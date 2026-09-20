import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service_role key.
 *
 * The service_role key bypasses RLS entirely, so this MUST only be used on the
 * server (API routes / server components) and never exposed to the client.
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}