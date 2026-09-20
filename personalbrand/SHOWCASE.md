# Showcase — Personal Branding & Publishing Portal

A modern, full-stack personal branding platform: a **portfolio**, an **education hub**, a **media gallery**, a **newsletter/blog engine**, and a **gated admin dashboard** — all in one deployable app.

**Stack:** Next.js (App Router) · Supabase (DB + RLS + Storage) · Clerk (Auth) · Resend (Email) · Tailwind CSS

---

## The big picture

| Layer | What it does |
| --- | --- |
| **Public site** | Hero, stack grid, portfolio, education hub, media gallery, blog, newsletter, contact |
| **Admin dashboard** | Write & publish posts, manage portfolio/education, edit site settings, manage subscribers, view analytics |
| **Newsletter engine** | One publish action → live blog post (SEO) **+** email dispatch to subscribers |
| **Auth & security** | Clerk protects `/admin/*`; Supabase RLS lets the public read only published content |

---

## Public site

- **Home** — value-prop hero, dual-track stack grid (Data Engineering vs Web), portfolio split into **Owned** vs **Client**, education links, media gallery, latest posts, and a prominent newsletter opt-in.
- **Blog** — `/blog` index and `/blog/[slug]` detail pages with server-generated metadata for SEO.
- **Portfolio** — index plus detail pages (`/portfolio/<id>`) with tech-stack tags.
- **Education hub** — links to courses / instructional content.
- **Media gallery** — embedded videos and thumbnails.
- **Contact** — contact form that stores messages.
- **Dark mode** — one-click sun/moon toggle, remembers your choice, follows your OS by default.

## Admin dashboard (`/admin`)

- **Overview** — live stat cards (posts, active/total subscribers, messages, portfolio).
- **Posts** — full lifecycle: **Markdown editor with live preview**, auto-slug, excerpt, featured image, publish/unpublish/delete.
- **Portfolio** — full CRUD with type (owned/client), tech stack, URL, image, publish toggle.
- **Education** — CRUD for course links.
- **Settings** — edit hero headline, tagline, contact email, social links and theme colors (JSON).
- **Subscribers** — status counts, full list, unsubscribe/delete, and **one-click CSV export**.
- **Analytics** — open/click/bounce counts, estimated open rate, recent email events.

## Unified publishing flow

When the owner hits **Publish** on a post:
1. The post is marked `is_published` and timestamped.
2. It immediately appears at `/blog/[slug]` (indexed for search).
3. A newsletter email is dispatched to every active subscriber.
4. Opens/clicks/bounces come back through the Resend webhook and feed the analytics dashboard.

---

## Architecture

- **Frontend:** Next.js App Router + Tailwind (TypeScript), with dark mode.
- **Auth:** Clerk (`/admin/*` protected via middleware; sign-in/sign-up pages).
- **Database:** Supabase with 11 tables, Row Level Security (public = read-only published content; admin = full CRUD), and storage buckets for `media` (public) and `lead-magnets` (private).
- **Email:** Resend, triggered from Next.js API routes.
- **SEO:** `sitemap.xml`, `robots.txt`, Open Graph / Twitter metadata, `generateMetadata` on post pages.

---

## Try it

```bash
pnpm install
pnpm dev
```

Open **http://localhost:3000** for the public site.
Sign in at **http://localhost:3000/admin** with your Clerk account to manage content.

See `TESTING-GUIDE.md` for a detailed walkthrough of every feature.