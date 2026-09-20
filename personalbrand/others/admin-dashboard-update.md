# Project Update — Admin Dashboard + Public Pages Complete

## Admin dashboard (all behind Clerk, `/admin/*` protected)

- **Overview** — stat cards (posts, active/total subscribers, messages, portfolio).
- **Posts** — list with publish/unpublish/delete, plus Markdown editor with live preview, auto-slug, excerpt, featured image, publish toggle.
- **Portfolio** — full CRUD (type, title, description, tech stack, url, image, published).
- **Education** — CRUD for course links.
- **Settings** — edit hero headline/subtitle, tagline, contact email, social links JSON, theme colors.
- **Subscribers** — status counts, full list, unsubscribe/delete, CSV export.
- **Analytics** — opens/clicks/bounces counts, open-rate, recent events.

## Public pages added

- `/portfolio/[id]` detail, `/subscribe`, `/unsubscribe`, plus `/sign-in` and `/sign-up` (Clerk).

## Content seeded

- 4 published fake blog posts written and inserted directly into Supabase via `scripts/seed-blog.mjs` (rendered from Markdown). They show on `/blog` now.

## To use the admin

1. Visit `http://localhost:3000/admin` in a **real browser** (curl 404s by design — Clerk dev-mode protects via rewrite; browsers get the sign-in flow).
2. Sign in with your Clerk admin user. Your Clerk instance (`splendid-satyr-33`) is already wired via `.env.local`.

## Two notes

- Admin writes use the service-role key (bypasses RLS), so they work regardless of the Clerk↔Supabase JWT template. The `supabase` JWT template matters only if you switch admin data access to the browser client (`useSupabase`).
- `scripts/seed-blog.mjs` is reusable — edit the `posts` array and rerun (`source .env.local && node scripts/seed-blog.mjs`) to add more.