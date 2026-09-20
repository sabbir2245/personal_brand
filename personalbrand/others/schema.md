# Database Schema

Personal Branding & Publishing Portal — Supabase schema, RLS policies, and storage.

Source: `supabase-schema.sql`

---

## Extensions

| Extension | Purpose |
|-----------|---------|
| `citext`  | Case-insensitive email columns (`subscribers.email`) |
| `pgcrypto`| `gen_random_uuid()` defaults and hash helpers |

---

## Tables

### Core

#### `site_settings` (singleton)
Singleton row holding site-wide branding and display settings.

| Column        | Type        | Default              | Notes |
|---------------|-------------|----------------------|-------|
| `id`          | uuid        | `gen_random_uuid()`  | PK    |
| `site_name`   | text        | `null`               |       |
| `tagline`     | text        | `null`               |       |
| `hero_headline`| text       | `null`               |       |
| `hero_subtitle`| text       | `null`               |       |
| `theme_colors`| jsonb       | `'{}'`               |       |
| `social_links`| jsonb       | `'{}'`               |       |
| `contact_email`| text       | `null`               |       |
| `logo_url`    | text        | `null`               |       |
| `created_at`  | timestamptz | `now()`              |       |
| `updated_at`  | timestamptz | `now()`              | auto-updated |

- Unique index `site_settings_singleton` on `((true))` enforces a single row.

#### `posts`
Blog / article content.

| Column           | Type        | Default  | Notes |
|------------------|-------------|----------|-------|
| `id`             | uuid        | `gen_random_uuid()` | PK |
| `title`          | text        | (not null) |    |
| `slug`           | text        | (not null) | unique |
| `html_content`   | text        | `''`     |       |
| `excerpt`        | text        | `null`   |       |
| `featured_image` | text        | `null`   |       |
| `is_published`   | boolean     | `false`  |       |
| `published_at`   | timestamptz | `null`   |       |
| `created_at`     | timestamptz | `now()`  |       |
| `updated_at`     | timestamptz | `now()`  | auto-updated |

#### `portfolio_items`
Portfolio works, typed as own or client.

| Column        | Type        | Default              | Notes |
|---------------|-------------|----------------------|-------|
| `id`          | uuid        | `gen_random_uuid()`  | PK    |
| `type`        | text        | (not null)           | check: `own` / `client` |
| `title`       | text        | (not null)           |       |
| `description` | text        | `null`               |       |
| `tech_stack`  | text[]      | `'{}'`               |       |
| `url`         | text        | `null`               |       |
| `image`       | text        | `null`               |       |
| `is_published`| boolean     | `false`              |       |
| `created_at`  | timestamptz | `now()`              |       |

#### `subscribers`
Email newsletter subscribers.

| Column          | Type        | Default   | Notes |
|-----------------|-------------|-----------|-------|
| `id`            | uuid        | `gen_random_uuid()` | PK |
| `email`         | citext      | (not null)| unique, case-insensitive |
| `status`        | text        | `'active'`| check: `active` / `unsubscribed` / `bounced` |
| `lead_magnet_id`| uuid        | `null`    | FK → `lead_magnets.id` (on delete set null) |
| `created_at`    | timestamptz | `now()`   |       |

### Supporting

#### `tags`
Content tags.

| Column       | Type   | Default | Notes |
|--------------|--------|---------|-------|
| `id`         | uuid   | `gen_random_uuid()` | PK |
| `name`       | text   | (not null) |     |
| `slug`       | text   | (not null) | unique |
| `created_at` | timestamptz | `now()` |     |

#### `post_tags` (join)
Many-to-many between posts and tags.

| Column    | Type | Notes |
|-----------|------|-------|
| `post_id` | uuid | FK → `posts.id` (on delete cascade), part of PK |
| `tag_id`  | uuid | FK → `tags.id` (on delete cascade), part of PK |

- Composite PK: `(post_id, tag_id)`.

#### `education_links`
Curated learning resource links.

| Column       | Type   | Default | Notes |
|--------------|--------|---------|-------|
| `id`         | uuid   | `gen_random_uuid()` | PK |
| `title`      | text   | (not null) |     |
| `description`| text   | `null`   |       |
| `url`        | text   | `null`   |       |
| `image`      | text   | `null`   |       |
| `sort_order` | int    | `0`      |       |
| `created_at` | timestamptz | `now()` |     |

#### `media`
Embeddable media content (YouTube, video, audio, reel).

| Column       | Type   | Default | Notes |
|--------------|--------|---------|-------|
| `id`         | uuid   | `gen_random_uuid()` | PK |
| `title`      | text   | (not null) |     |
| `type`       | text   | (not null) | check: `youtube` / `video` / `audio` / `reel` |
| `embed_url`  | text   | `null`   |       |
| `thumbnail`  | text   | `null`   |       |
| `sort_order` | int    | `0`      |       |
| `created_at` | timestamptz | `now()` |     |

#### `lead_magnets`
Downloadable resources offered to subscribers.

| Column          | Type   | Default | Notes |
|-----------------|--------|---------|-------|
| `id`            | uuid   | `gen_random_uuid()` | PK |
| `title`         | text   | (not null) |     |
| `file_url`      | text   | `null`   |       |
| `download_count`| int    | `0`      |       |
| `created_at`    | timestamptz | `now()` |     |

#### `messages`
Contact-form submissions.

| Column       | Type   | Default | Notes |
|--------------|--------|---------|-------|
| `id`         | uuid   | `gen_random_uuid()` | PK |
| `name`       | text   | (not null) |     |
| `email`      | text   | (not null) |     |
| `message`    | text   | (not null) |     |
| `status`     | text   | `'new'` | check: `new` / `read` / `archived` |
| `created_at` | timestamptz | `now()` |     |

#### `email_analytics`
Tracking events for newsletter engagement.

| Column           | Type   | Default | Notes |
|------------------|--------|---------|-------|
| `id`             | uuid   | `gen_random_uuid()` | PK |
| `subscription_id`| uuid   | `null`   | FK → `subscribers.id` (on delete cascade) |
| `event`          | text   | (not null) | check: `open` / `click` / `bounce` |
| `occurred_at`    | timestamptz | `now()` |     |

---

## Relationships

```
site_settings ───── singleton
posts 1──< post_tags >──1 tags
posts (updated_at trigger)
subscribers ──> lead_magnets (set null)
email_analytics ──> subscribers (cascade)
```

---

## Row Level Security (RLS)

RLS is enabled on all tables. Policies follow a consistent pattern:

- **Public (anon):** `SELECT` only, and only on published/public content.
- **Admin (authenticated `auth.uid()`):** full CRUD.
- **Private tables:** no anon access; writes go through API routes using the service key.

| Table | Public (anon) | Admin (authenticated) |
|-------|---------------|------------------------|
| `posts` | SELECT where `is_published = true` | all |
| `portfolio_items` | SELECT where `is_published = true` | all |
| `site_settings` | SELECT (all rows) | all |
| `subscribers` | — | SELECT / UPDATE / DELETE |
| `tags` | SELECT | all |
| `post_tags` | SELECT | all |
| `education_links` | SELECT | all |
| `media` | SELECT | all |
| `lead_magnets` | SELECT | all |
| `messages` | — | all |
| `email_analytics` | — | SELECT / DELETE |

> **Note:** `subscribers` has no anon INSERT policy; new subscriptions are inserted via API routes using the service key. Anon direct `SELECT`/`INSERT` on `subscribers` and `messages` is disallowed.

---

## Triggers

| Trigger | Table | Timing | Function |
|---------|-------|--------|----------|
| `trg_posts_updated` | `posts` | before update | `set_updated_at()` |
| `trg_settings_updated` | `site_settings` | before update | `set_updated_at()` |

`set_updated_at()` sets `NEW.updated_at = now()` on every row update.

---

## Storage

| Bucket       | Public | Access |
|--------------|--------|--------|
| `media`      | yes    | Public read; admin write |
| `lead-magnets` | no   | Admin select/write only (private) |

Policies on `storage.objects`:

| Policy | Bucket | Role | Operation |
|--------|--------|------|-----------|
| `media public read` | `media` | anon | select |
| `media admin write` | `media` | authenticated | all |
| `magnets admin select` | `lead-magnets` | authenticated | select |
| `magnets admin write` | `lead-magnets` | authenticated | all |
