# How to Run & Test — Personal Branding Portal

This guide walks you through running the app locally and testing every feature end-to-end.

---

## 1. Prerequisites

- **Node.js** (v22+)
- **pnpm** (used by this project). If not on PATH, use:
  ```bash
  npm i -g pnpm@11
  ```
- A populated Supabase database (schema + seed already run).
- Your `.env.local` already has valid Supabase, Clerk, and Resend keys.

## 2. Install dependencies

```bash
pnpm install
```

## 3. Run the dev server

```bash
pnpm dev
```

Open **http://localhost:3000**.

> Note: `pnpm` may not be installed globally. If `pnpm` isn't found, install it with
> `npm i -g pnpm@11`, or use the existing local binary at
> `/tmp/opencode/pnpm/node_modules/.bin/pnpm` (this workspace).

---

## 4. Test the public site

| Page | What to check |
| --- | --- |
| `/` (Home) | Hero headline/subtitle, stack grid, portfolio (Owned vs Client), Education hub, Media gallery, Latest posts, newsletter form |
| `/blog` | Shows the 4 seeded published posts |
| `/blog/<slug>` | Full post with rendered Markdown; check page `<title>`/description metadata in the browser |
| `/portfolio` | Lists portfolio items grouped by type; click a card to open the detail page |
| `/portfolio/<id>` | Detail page with tech-stack tags and "Visit project" button |
| `/education` | Course links grid |
| `/media` | Media gallery grid |
| `/contact` | Contact form → submit sends to `/api/contact` |
| `/subscribe` | Success page |
| `/unsubscribe` | Enter an email to unsubscribe via `/api/unsubscribe` |

### Dark / light mode
Click the **sun/moon toggle** in the header. It:
- switches instantly,
- remembers your choice in `localStorage` (survives reloads),
- defaults to your OS preference on first visit.

### Newsletter (end-to-end)
1. On the Home page, enter a real email and click **Subscribe**.
2. It calls `POST /api/subscribe`, inserts the subscriber, and (if Resend is configured) sends a welcome email.
3. Go to `/admin/subscribers` to see the new subscriber with status `active`.

---

## 5. Test the admin dashboard

Visit **http://localhost:3000/admin** in a **real browser** and sign in with your Clerk admin user.

> **Why it "404s" in curl/Postman:** Clerk's dev-mode middleware protects `/admin/*` via a
> rewrite (`protect-rewrite, dev-browser-missing`). Real browsers get the sign-in flow; API
> clients without Clerk's dev-browser cookie do not. Use a browser.

### Overview
Stat cards: posts, active subscribers, total subscribers, messages, portfolio items.

### Posts
- **Create:** `New post` → write in Markdown → **Preview** to see rendered HTML → set slug/excerpt/image → Save.
  - Auto-slug: the slug fills in as you type the title.
  - Unpublished posts are saved as **drafts** and do NOT appear on the public `/blog`.
- **Publish:** on the posts list, click **Publish** → the post becomes live and `published_at` is set.
  - If Resend is configured and there are active subscribers, publishing also dispatches the newsletter email (`POST /api/publish`).
- **Edit / Unpublish / Delete** are available in the list.

### Portfolio
- Add items (Owned vs Client), set tech stack (comma-separated), URL, image, published toggle. Edit/delete from the list.

### Education
- Add/edit/delete course links (title, description, url, sort order).

### Settings
- Edit site name, tagline, hero headline/subtitle, contact email, social links (JSON), theme colors (JSON). Save → home page reflects changes.

### Subscribers
- See status counts (active / unsubscribed / bounced), the full list, per-row **Unsubscribe**/**Delete**, and **Export CSV** (downloads `subscribers.csv`).

### Analytics
- Shows opens / clicks / bounces counts, estimated open rate, and recent events.
  - Populated by the Resend webhook (`POST /api/webhooks/resend`) when emails are opened/clicked/bounced.

---

## 6. API routes reference

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/subscribe` | POST | Validate + insert subscriber, send welcome email |
| `/api/contact` | POST | Insert contact message |
| `/api/publish` | POST | Publish a post + dispatch newsletter |
| `/api/unsubscribe` | GET | Flip subscriber status to `unsubscribed` |
| `/api/webhooks/resend` | POST | Record open/click/bounce; flip to `bounced` |
| `/api/lead-magnet` | GET | Serve lead magnet + increment download count |

---

## 7. Re-seeding / adding sample content

The database already contains sample content. To add or update sample blog posts:

```bash
source .env.local && node scripts/seed-blog.mjs
```

Edit the `posts` array in `scripts/seed-blog.mjs` to change the content. It upserts by slug, so it's safe to rerun.

---

## 8. Production build check

```bash
pnpm build   # type-checks + builds
pnpm start   # serves the production build
```

---

## 9. Troubleshooting

- **Blog/posts empty** → the posts are drafts (`is_published = false`) or not seeded. Publish them from the admin, or run the seed script.
- **Emails not sending** → verify your Resend domain is verified and `RESEND_FROM` is set to an allowed sender (the fallback `onboarding@resend.dev` only works in Resend test mode).
- **Newsletter shows success but no subscriber** → check `SUPABASE_SERVICE_ROLE_KEY` is present in `.env.local`.
- **Admin redirect loop / odd 404** → use a real browser; Clerk dev-mode needs the dev-browser cookie.