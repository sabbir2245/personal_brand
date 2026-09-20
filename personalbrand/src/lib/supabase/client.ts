import { createClient } from "@supabase/supabase-js";

type GetToken = () => Promise<string | null>;

/**
 * Browser-side Supabase client.
 *
 * Every request is authenticated by injecting the Clerk session JWT as the
 * Supabase Authorization header. This lets Supabase RLS read `auth.uid()` for
 * the logged-in admin (see the "supabase" Clerk JWT template).
 *
 * The `getToken` function must be supplied by the caller (usually from
 * `useAuth().getToken`) because it lives inside a React component.
 */
export function createBrowserClient(getToken: GetToken) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: (input, init) => {
          return getToken().then((token) => {
            const headers = new Headers(init?.headers);
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return fetch(input, { ...init, headers });
          });
        },
      },
    },
  );
}