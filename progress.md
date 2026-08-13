# VIP Progress Checklist

Task list for building the **Personal Branding & Publishing Portal** (Next.js + Supabase + Clerk + Tailwind).

Legend: `[ ]` todo · `[x]` done

## 1. Planning & Setup
- [x] Convert `assignment.pdf` to `assignment.md`
- [x] Analyze reference website HTML structure
- [x] Write `website-plan.md` (structure + backend requirements + schema)
- [ ] Scaffold Next.js app (App Router, TypeScript, Tailwind)
- [ ] Install deps: `@supabase/supabase-js`, `@clerk/nextjs`, `resend`
- [ ] Set up env vars (Supabase, Clerk, Resend keys)

## 2. Supabase Database
- [ ] Create tables: `site_settings`, `posts`, `portfolio_items`, `subscribers`
- [ ] Add supporting tables: `tags`, `post_tags`, `media`, `lead_magnets` (optional)
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Add RLS policies: public SELECT published only; admin full CRUD
- [ ] Create storage buckets for media / lead magnet files

## 3. Authentication (Clerk)
- [ ] Set up Clerk provider + middleware
- [ ] Protect `/admin/*` routes via Next.js middleware
- [ ] Wire Clerk user id into Supabase `auth.uid()` for admin policies

## 4. Public Site
- [ ] Global layout: nav + footer with social links
- [ ] Hero section (dual-strength positioning + primary CTA)
- [ ] Stack / Services grid (Data Engineering vs Web)
- [ ] Portfolio showcase (owned vs client work)
- [ ] Education Hub links (courses)
- [ ] Media gallery (YouTube embeds)
- [ ] Newsletter signup form (lead magnet opt-in)
- [ ] `/blog` index page
- [ ] `/blog/[slug]` dynamic post page with SEO metadata
- [ ] `/portfolio/[slug]` detail pages
- [ ] `/contact` page + contact form
- [ ] `/subscribe` success / `/unsubscribe` pages

## 5. Admin Dashboard
- [ ] Dashboard shell behind Clerk auth
- [ ] Rich text / Markdown editor for posts
- [ ] CRUD for portfolio items
- [ ] CRUD for site settings / social links / hero headline
- [ ] Subscriber list + counts + export CSV
- [ ] Manage unsubscribes
- [ ] Analytics overview (open rates, top posts)

## 6. API Routes
- [ ] `POST /api/subscribe` (insert subscriber + send confirmation)
- [ ] `POST /api/publish` (publish post + trigger email dispatch)
- [ ] `POST /api/unsubscribe`
- [ ] `POST /api/webhooks/resend` (opens/clicks -> analytics)
- [ ] Lead magnet download endpoint / access

## 7. Email (Resend / SendGrid)
- [ ] Newsletter email template
- [ ] Welcome / confirmation email
- [ ] Trigger dispatch to active subscribers on publish
- [ ] Handle bounces / unsubscribes

## 8. SEO & Performance
- [ ] `sitemap.ts`
- [ ] `generateMetadata` on `/blog/[slug]`
- [ ] `robots.txt`, Open Graph / Twitter cards
- [ ] Image optimization (next/image)

## 9. Testing & Deploy
- [ ] Validate RLS policies with anon vs admin
- [ ] Test subscribe -> publish -> email flow end-to-end
- [ ] Deploy to Vercel
- [ ] Final review against `assignment.md` requirements