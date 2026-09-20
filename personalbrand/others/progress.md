# VIP Progress Checklist

Task list for building the **Personal Branding & Publishing Portal** (Next.js + Supabase + Clerk + Tailwind).

Legend: `[ ]` todo · `[x]` done

## 1. Planning & Setup
- [x] Convert `assignment.pdf` to `assignment.md`
- [x] Analyze reference website HTML structure
- [x] Write `website-plan.md` (structure + backend requirements + schema)
- [x] Scaffold Next.js app (App Router, TypeScript, Tailwind)
- [x] Install deps: `@supabase/supabase-js`, `@clerk/nextjs`, `resend`
- [x] Set up env vars (Supabase, Clerk, Resend keys) — `.env.local` from `pasword.md`
- [x] Add dark / light mode toggle (class-based, Tailwind v4)

## 2. Supabase Database
- [x] Create tables: `site_settings`, `posts`, `portfolio_items`, `subscribers`
- [x] Add supporting tables: `tags`, `post_tags`, `media`, `lead_magnets`, `messages`, `email_analytics`
- [x] Enable Row Level Security (RLS) on all tables
- [x] Add RLS policies: public SELECT published only; admin full CRUD
- [x] Create storage buckets (`media` public, `lead-magnets` private) + policies
- [x] Seed sample content (`supabase-seed.sql`)
- [x] Seed 4 published fake blog posts (`scripts/seed-blog.mjs`)

## 3. Authentication (Clerk)
- [x] Set up Clerk provider + middleware
- [x] Protect `/admin/*` routes via Next.js middleware
- [x] Wire Clerk user id into Supabase `auth.uid()` for admin policies (JWT template `supabase` + `use-supabase` hook)
- [ ] Verify Clerk->Supabase token in browser (needs the "supabase" JWT template)

## 4. Public Site
- [x] Global layout: nav + footer with social links
- [x] Hero section (dual-strength positioning + primary CTA)
- [x] Stack / Services grid (Data Engineering vs Web)
- [x] Portfolio showcase (owned vs client work)
- [x] Education Hub links (courses)
- [x] Media gallery (YouTube embeds)
- [x] Newsletter signup form (lead magnet opt-in)
- [x] `/blog` index page
- [x] `/blog/[slug]` dynamic post page with SEO metadata
- [x] `/portfolio/[id]` detail pages
- [x] `/contact` page + contact form
- [x] `/subscribe` success / `/unsubscribe` pages
- [x] `/sign-in`, `/sign-up` Clerk pages

## 5. Admin Dashboard
- [x] Dashboard shell behind Clerk auth (sidebar + overview)
- [x] Rich text / Markdown editor for posts (with live preview)
- [x] CRUD for portfolio items
- [x] CRUD for education links
- [x] CRUD for site settings / social links / hero headline
- [x] Subscriber list + counts + export CSV
- [x] Manage unsubscribes
- [x] Analytics overview (open rates, events)

## 6. API Routes
- [x] `POST /api/subscribe` (insert subscriber + send confirmation)
- [x] `POST /api/publish` (publish post + trigger email dispatch)
- [x] `POST /api/unsubscribe`
- [x] `POST /api/webhooks/resend` (opens/clicks/bounces -> analytics)
- [x] Lead magnet download endpoint / access
- [ ] `POST /api/lead-magnet` download counter verified (optional)

## 7. Email (Resend / SendGrid)
- [x] Newsletter email template (in `src/lib/email.ts`)
- [x] Welcome / confirmation email
- [x] Trigger dispatch to active subscribers on publish
- [x] Handle bounces / unsubscribes
- [ ] Verify a Resend domain + set `RESEND_FROM` (currently `onboarding@resend.dev`)

## 8. SEO & Performance
- [x] `generateMetadata` on `/blog/[slug]`
- [ ] `sitemap.ts`
- [ ] `robots.txt`, Open Graph / Twitter cards
- [ ] Image optimization (next/image) — some pages use `<img>`

## 9. Optional / data.txt items
- [ ] Auto-fetch 5 latest YouTube videos (`@LinusTechTips`) via YouTube Data API

## 10. Testing & Deploy
- [ ] Validate RLS policies with anon vs admin
- [ ] Test subscribe -> publish -> email flow end-to-end
- [ ] Deploy to Vercel
- [ ] Final review against `assignment.md` requirements