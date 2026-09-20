# Setup Guide — Personal Branding Portal

How authentication works, and everything you need to set up **in order**.

---

## 1. How the Site Knows an Admin Is Logged In

The **admin logs in** — that's Clerk's job.

**The flow:**

1. **Login** — Admin visits `/admin`, Clerk shows a login page (magic link / email / password / Google, etc.). After login, Clerk sets a signed session cookie in the browser.

2. **Next.js knows** — On every request, Clerk checks that cookie. `middleware.ts` protects `/admin`:
   ```ts
   export default clerkMiddleware((auth, req) => {
     if (req.nextUrl.pathname.startsWith('/admin') && !auth().userId) {
       return redirect('/sign-in');
     }
   });
   ```
   No user → redirect to sign-in. Logged in → allowed into the dashboard.

3. **Supabase knows (RLS)** — Supabase's `auth.uid()` reads a **JWT** sent with every request. Your app sends the Clerk session as the Supabase auth token:
   - **Client-side:** `createClient` with Clerk's session token passed as the Supabase auth token.
   - Then `auth.uid()` in RLS returns the admin's id → policies like `auth.uid() is not null` pass → writes allowed.
   - **Anonymous/public visitors** send the **anon key** (no user) → `auth.uid()` is null → can only read published rows.

**Summary:** Two layers: **Clerk** controls *who gets into the dashboard*, and **Supabase RLS** controls *what that user can do with the data*, checked on every query via the token in the request.

---

## 2. Setup Steps, In Order

### Step 1 — Create the Supabase project
1. Go to [supabase.com](https://supabase.com) → **New project** (one project per client instance).
2. Note the project **Region**, name, and DB password.
3. After creation, go to **Settings → API** and copy:
   - `Project URL`
   - `anon` key (safe for public/client code)
   - `service_role` key (server-only — never expose this!)

### Step 2 — Run the database schema
1. In the Supabase dashboard, open **SQL Editor** → **New query**.
2. Copy the entire contents of `supabase-schema.sql` and paste it in.
3. Click **Run**. This creates all tables + RLS policies.
4. Go to **Storage** → **New bucket** → create `media` (public) and `lead-magnets` (private) buckets.

### Step 3 — Create the Clerk application
1. Go to [clerk.com](https://clerk.com) → **Add Application** → Next.js → set sign-in options (email, Google, etc.).
2. Note the keys from **API Keys** tab:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. In Clerk **Users**, add/create your admin user.

### Step 4 — Create the Resend account (for email)
1. Go to [resend.com](https://resend.com) → create account → verify a domain.
2. Copy `RESEND_API_KEY`.
3. Optionally create an audience + a template for the newsletter.

### Step 5 — Scaffold the Next.js project locally
```bash
npx create-next-app@latest personalbrand
# choose: TypeScript, App Router, Tailwind
cd personalbrand
```

### Step 6 — Install dependencies
```bash
npm install @supabase/supabase-js @clerk/nextjs resend
```

### Step 7 — Create `.env.local`
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-pk
CLERK_SECRET_KEY=your-secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Resend
RESEND_API_KEY=re_xxxx
```

### Step 8 — Add Clerk providers + middleware
- Wrap the app in `<ClerkProvider>` (in `app/layout.tsx`).
- Create `middleware.ts` at the project root protecting `/admin/*`.
- Add `sign-in` / `sign-up` page routes.

### Step 9 — Set up Supabase clients
- `lib/supabase/client.ts` → `createClient` for the browser (uses anon key + Clerk session token).
- `lib/supabase/server.ts` → server client using the service-role key (for API routes).

### Step 10 — Build the public pages
- Global nav + footer (social links from `site_settings`).
- Hero, stack grid, portfolio, education hub, media gallery.
- Newsletter signup form → `POST /api/subscribe`.

### Step 11 — Build the API routes
- `/api/subscribe` — validate + insert subscriber + send Resend welcome email.
- `/api/publish` — set post published + trigger email dispatch.
- `/api/unsubscribe` — flip status.
- `/api/webhooks/resend` — record opens/clicks/bounces.
- `/api/contact` — insert into `messages`.

### Step 12 — Build the admin dashboard (behind Clerk)
- Posts CRUD + Markdown/WYSIWYG editor.
- Portfolio CRUD. Subscriber list/export/unsubscribe. Site settings editor.
- Simple analytics view (from `email_analytics`).

### Step 13 — SEO
- `/blog/[slug]` dynamic route with `generateMetadata`.
- `sitemap.ts`, `robots.ts`, Open Graph/twitter meta.

### Step 14 — Deploy
1. Push to GitHub → import into Vercel.
2. Add the same `.env` variables in Vercel → **Settings → Environment Variables**.
3. Deploy. Verify: subscribe → publish → email flow; admin access on `/admin`; RLS restricts public reads.

---

## 3. Order Cheat-Sheet
1. Supabase project
2. Run schema (`supabase-schema.sql`) + storage buckets
3. Clerk app + admin user
4. Resend account + domain
5. Scaffold Next.js
6. Install deps
7. `.env.local`
8. Clerk provider + middleware
9. Supabase clients
10. Public pages
11. API routes
12. Admin dashboard
13. SEO
14. Deploy to Vercel