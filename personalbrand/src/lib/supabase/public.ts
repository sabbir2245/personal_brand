import { createClient } from "@supabase/supabase-js";

/**
 * Public-read Supabase client using the anon key. Respects RLS, so it can
 * only see rows public policies allow (published posts, public settings, etc).
 * Safe for server components that render public content.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}