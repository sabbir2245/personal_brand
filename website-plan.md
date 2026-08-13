# Website Plan — Personal Branding & Publishing Portal

**Source:** `assignment.md` (PRD) + structure analysis of the reference site (`referencewebiste/`, a marketing agency / personal-brand site).

---

## 1. What I Learned From the Reference Site

The reference site is a personal brand + agency site. Reusable structural patterns:

- **Sticky global nav** — Home, About, Services, Insights (blog), Press, Reviews, Careers, Contact + social links in header.
- **Hero section** — value prop + primary CTA ("get more customers").
- **Services grid** — capabilities separated into cards (SEO, GEO, Ads, Email, Web Dev, CRO, Analytics).
- **Results / testimonials section** — "Results that speak for themselves", "Success stories" page.
- **Latest articles** — blog list (Insights) with categories, tags, slug routes.
- **Latest from YouTube** — embedded/grid of video thumbnails.
- **Newsletter / opt-in** — "Marketing insights, straight from the field".
- **Social footer** — LinkedIn, YouTube, X, Instagram, Facebook + mailto/contact CTA.
- **CTA band** — "Let's start a conversation" / recurring conversion call-to-action.

The PRD maps these concepts to a **dual-track personal brand**: Data Engineering (Databricks, PySpark) + Web (Next.js, Supabase), selling services + courses (Education Hub).

---

## 2. Backend Requirements (Beyond Supabase)

Supabase is the database + auth-enforcement layer, but the full backend needs these additional pieces:

### 2.1 Authentication — Clerk
- Handles admin identity; no user table needed in Supabase (Clerk owns it).
- Next.js `middleware.ts` protects `/admin/*`.
- Admin RLS policies reference Clerk id via a Supabase trigger/setting on `auth.uid()`.

### 2.2 Email Service Provider (ESP) — Resend (recommended) or SendGrid
- Supabase **cannot** send emails. Required for: welcome/confirmation, bulk newsletter dispatch on publish, lead-magnet delivery.
- Triggered from a Next.js API route, not from Supabase.
- Webhooks (opens/clicks/bounces) feed analytics + unsubscribe handling.

### 2.3 Next.js API Routes (application glue)
`/api/subscribe` · `/api/publish` · `/api/unsubscribe` · `/api/webhooks/resend` · `/api/lead-magnet` · `/api/contact`

### 2.4 Secrets & Config
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `SERVICE_ROLE_KEY`, `CLERK_*`, `RESEND_API_KEY`.

### 2.5 Storage
- Supabase Storage buckets for embedded media, images, and lead-magnet files.

---

## 3. Database Schema (Supabase)

> Per-instance database, one per client. `uuid` PKs, `timestamptz` timestamps.

### 3.1 Core tables (from PRD)

**`site_settings`** — global config
| column | type | notes |
| --- | --- | --- |
| id | uuid pk | singleton |
| hero_headline | text | above-the-fold value prop |
| hero_subtitle | text | secondary line |
| site_name | text | brand name |
| tagline | text | |
| theme_colors | jsonb | primary/accent colors |
| social_links | jsonb | linkedin, youtube, x, github, instagram |
| contact_email | text | |
| logo_url | text | storage ref |

**`posts`** — newsletter issues doubling as blog posts
| column | type | notes |
| --- | --- | --- |
| id | uuid pk | |
| title | text | |
| slug | text unique | for `/blog/[slug]` |
| html_content | text | rendered body |
| excerpt | text | SEO/summary |
| featured_image | text | storage url |
| is_published | boolean | gating for public read |
| published_at | timestamptz | null until published |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**`portfolio_items`** — projects, case studies, SaaS products
| column | type | notes |
| --- | --- | --- |
| id | uuid pk | |
| type | text | `own` / `client` |
| title | text | |
| description | text | |
| tech_stack | text[] or jsonb | e.g. Databricks, Pyspark |
| url | text | outbound project link |
| image | text | storage url |
| is_published | boolean | |
| created_at | timestamptz | |

**`subscribers`**
| column | type | notes |
| --- | --- | --- |
| id | uuid pk | |
| email | citext unique | |
| status | text | `active` / `unsubscribed` / `bounced` |
| lead_magnet_id | uuid fk nullable | which magnet they got |
| created_at | timestamptz | |

### 3.2 Supporting tables

**`tags`** — id, name, slug
**`post_tags`** — post_id fk, tag_id fk (join, pk both)
**`education_links`** — Education Hub / courses: id, title, description, url, image, sort_order
**`media`** — media gallery: id, title, type (youtube/video/audio/reel), embed_url, thumbnail, sort_order
**`lead_magnets`** — opt-in offers: id, title, file_url, download_count
**`messages`** — contact form: id, name, email, message, status, created_at
**`email_analytics`** — subscription_id fk, event (open/click/bounce), occurred_at

---

## 4. Row Level Security (RLS) Policies

| Table | Public (anon/unauthenticated) | Authenticated Admin |
| --- | --- | --- |
| posts | SELECT only `is_published = true` | SELECT/INSERT/UPDATE/DELETE |
| portfolio_items | SELECT only `is_published = true` | SELECT/INSERT/UPDATE/DELETE |
| site_settings | SELECT (public display fields) | SELECT/UPDATE |
| subscribers | none (inserts via API, not direct) | SELECT/UPDATE status, DELETE |
| tags / post_tags | SELECT | SELECT/INSERT/UPDATE/DELETE |
| education_links / media | SELECT | SELECT/INSERT/UPDATE/DELETE |
| lead_magnets | SELECT | SELECT/UPDATE download_count |
| messages | none | SELECT/UPDATE status, DELETE |

- All public INSERTs (subscribers, messages) go through **authenticated API routes** using the server-side service key — the anon key has no write grants.
- Admin policies check `auth.uid()` against the Clerk-provisioned admin id (mapped via a `profiles`/sync table or a hard-coded admin secret in RLS).

---

## 5. Data Flow

**Subscribe:**
1. Visitor submits email in opt-in form.
2. `POST /api/subscribe` validates, checks duplicates, inserts into `subscribers`.
3. Fires a Resend welcome/confirmation email and serves the lead magnet.

**Publish (unified publishing):**
1. Admin drafts in the dashboard editor (Markdown/WYSIWYG), clicks publish.
2. `POST /api/publish` sets `is_published = true`, `published_at = now()`.
3. Kicks off Resend dispatch to all active subscribers (rendered email template).
4. Post immediately live at `/blog/[slug]` (SEO) with server-rendered `generateMetadata`.

**Unsubscribe / analytics:**
- Email links carry a signed token to `/api/unsubscribe`.
- Resend webhook → `/api/webhooks/resend` records open/click/bounce into `email_analytics` and flips `subscribers.status` on bounce.

---

## 6. Proposed Site Map

```
/
├── /                    Home (Hero, Stack grid, Portfolio preview, Education, Media, Newsletter, CTA)
├── /portfolio           Portfolio index (owned vs client)
│   └── /portfolio/[slug] Detail
├── /blog                Posts index (tagged/categorized)
│   └── /blog/[slug]     Post
├── /education           Education hub (courses)
├── /media               Media gallery
├── /about               About
├── /contact             Contact form + socials
├── /subscribe-success
├── /unsubscribe
└── /admin               Dashboard (Clerk-protected)
    ├── /admin/posts          CRUD + editor
    ├── /admin/portfolio      CRUD
    ├── /admin/education      CRUD
    ├── /admin/media          CRUD
    ├── /admin/subscribers    list/export/unsubscribe
    └── /admin/settings       site_settings editor
```

---

## 7. Tech Stack Recap
- **Frontend:** Next.js (App Router) + Tailwind CSS, TypeScript
- **Auth:** Clerk (admin routes gated via middleware)
- **DB + RLS + Storage:** Supabase (per-client instance)
- **Email:** Resend (ESP) via Next.js API routes + webhooks
- **Hosting:** Vercel