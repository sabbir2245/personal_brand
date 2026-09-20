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
    title: "The Witcher 3: why its world still sets the bar",
    slug: "witcher-3-world-bar",
    excerpt:
      "Ten years on, The Witcher 3's open world remains a masterclass in reactive, believable design. Here's what I think it teaches us about building software.",
    featured_image:
      "https://en.wikipedia.org/wiki/Special:FilePath/Witcher_3_cover_art.jpg",
    markdown: `## A world that reacts to you

The Witcher 3 isn't just big — it's **responsive**. Decisions made in one quest ripple into another hours later, and the world remembers what you did.

### What developers can take from it

- **Consistency wins.** When the world's rules stay true, players trust it.
- **Consequences matter.** Ship features whose outcomes echo.
- **Polish the edges.** Side quests get the same care as the main plot.

> A system is only as good as the smallest story it tells well.`,
  },
  {
    title: "Songs of the Past: building an unforgettable soundtrack",
    slug: "witcher-songs-of-the-past",
    excerpt:
      "The Witcher 3's score is inseparable from its identity. A look at how mood, restraint, and theme make music stick.",
    featured_image:
      "https://en.wikipedia.org/wiki/Special:FilePath/The_Witcher_3_Wild_Hunt_-_Songs_of_the_Past_key_art.jpg",
    markdown: `## Music as identity

"Songs of the Past" distills why The Witcher 3's soundtrack endures: it's built on **restraint** and a few strong themes rather than constant noise.

### The principles transfer to product design

1. **Less is more** — one clear motif beats a hundred busy ones.
2. **Mood over volume** — atmosphere drives engagement, not hype.
3. **Consistency breeds recognition** — repeat the core theme, vary the color.

> A strong identity repeats one great idea with discipline.`,
  },
  {
    title: "Cyberpunk 2077: a case study in scope and recovery",
    slug: "cyberpunk-2077-scope-recovery",
    excerpt:
      "From a rocky launch to a celebrated turnaround, Cyberpunk 2077 is a lesson in shipping scope, managing expectations, and rebuilding trust.",
    featured_image:
      "https://en.wikipedia.org/wiki/Special:FilePath/Cyberpunk_2077_box_art.jpg",
    markdown: `## The story of a comeback

Cyberpunk 2077 launched with hype that no release could survive. What followed — steady patches, updates, and a big comeback — is a study in **recovery**.

### What teams can learn

- **Scope honestly.** Ambition must match capacity.
- **Communicate clearly.** Set expectations you can actually meet.
- **Recover with action.** Rebuild trust by shipping, not promising.

> A setback is defined less by what happened than by how you respond.`,
  },
  {
    title: "Dijkstra's algorithm: the shortest path through your data",
    slug: "dijkstra-shortest-path",
    excerpt:
      "Graphs power everything from routing to recommendation systems. A plain-English look at Dijkstra's algorithm and where it shows up in engineering.",
    featured_image:
      "https://en.wikipedia.org/wiki/Special:FilePath/Dijkstra_Animation.gif",
    markdown: `## Find the shortest path, one node at a time

Dijkstra's algorithm finds the cheapest path in a weighted graph — and it's everywhere in the software you rely on.

### Where you already use it

- **GPS navigation** picking the fastest route
- **Network routing** moving packets efficiently
- **Recommendation engines** ranking the most relevant path

### The core idea

1. Start at the source with cost zero.
2. Visit the cheapest unvisited node.
3. Relax its neighbors, updating costs when a shorter path appears.
4. Repeat until every node is settled.

> Greedy, elegant, and foundational. If you work with connected data, Dijkstra is a tool worth knowing cold.`,
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
