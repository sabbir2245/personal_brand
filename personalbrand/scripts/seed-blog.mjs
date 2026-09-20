import { createClient } from "@supabase/supabase-js";
import { marked } from "marked";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE env vars");
  process.exit(1);
}

const supabase = createClient(url, key);

const posts = [
  {
    title: "Why I still write my own data pipelines",
    slug: "why-i-write-my-own-pipelines",
    excerpt:
      "Hand-rolled pipelines give you control, clarity, and portability. What I've learned shipping them in production.",
    featured_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80",
    markdown: `## Control you can't buy

Off-the-shelf tools are great until they aren't. Writing your own pipeline gives you **full visibility** into every stage and the freedom to change it when your data grows.

### What I actually reach for

- **Databricks** for heavy compute
- **PySpark** for transformations at scale
- A thin Python layer to orchestrate it all

> Start boring. Start simple. Only add machinery when the bottleneck hurts.

The real win isn't the code — it's understanding your own data deeply enough to own the entire flow.`,
  },
  {
    title: "Scaling a web platform the boring way",
    slug: "scaling-a-web-platform-the-boring-way",
    excerpt:
      "Most scaling problems are solved before you scale. A pragmatic guide to sizing, caching, and databases.",
    featured_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80",
    markdown: `## Scale is a consequence, not a goal

Nine times out of ten the fix isn't more servers — it's a **better query** or a **smarter cache**.

### The boring checklist

1. **Measure first.** Profile before you optimize.
2. **Cache aggressively** at the edge.
3. **Index what you query** — read the plan.
4. **Use the right database** for the job.

A platform built on **Next.js + Supabase** can go very far on one well-architected instance. Add complexity only when the numbers tell you to.`,
  },
  {
    title: "Build in public: shipping a SaaS in 6 weeks",
    slug: "build-in-public-saas-6-weeks",
    excerpt:
      "A field report on turning an idea into a paying product fast — and what I'd do differently.",
    featured_image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1600&q=80",
    markdown: `## The plan

Six weeks, one founder, a real product. The stack: **Next.js**, **Supabase**, and a lot of coffee.

### What moved the needle

- Launch a **landing page** on day one to capture emails
- Build the **one** feature people would pay for
- Get **real users** before polishing the rest

The hardest part wasn't code — it was deciding what *not* to build. Scope discipline wins.`,
  },
  {
    title: "My teardown of a zero-code MVP",
    slug: "teardown-zero-code-mvp",
    excerpt:
      "You can validate an idea without writing much code. Here's how I'd structure a no-code prototype.",
    featured_image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600&q=80",
    markdown: `## Validate before you build

A zero-code MVP tests the riskiest assumption: **does anyone want this?**

### A lean stack

- Forms and automation for the "backend"
- A simple database for the data
- A template site for the front door

The goal is **one** real signal: a stranger taking an action. Everything else is optional until that works.`,
  },
];

let inserted = 0;
for (const post of posts) {
  const html_content = marked.parse(post.markdown, { async: false });
  const { data, error } = await supabase
    .from("posts")
    .upsert(
      {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        featured_image: post.featured_image ?? null,
        html_content,
        is_published: true,
        published_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    )
    .select("id");
  if (error) {
    console.error("Failed for", post.slug, error.message);
  } else {
    inserted += data?.length ?? 0;
  }
}

console.log(`Done. Inserted/updated ${inserted} published posts.`);