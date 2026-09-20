import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE env vars");
  process.exit(1);
}

const supabase = createClient(url, key);

const items = [
  { title: "Video Q-DXwZEO21g", type: "youtube", embed_url: "https://youtu.be/Q-DXwZEO21g" },
  { title: "Video maDF27QsgG8", type: "youtube", embed_url: "https://youtu.be/maDF27QsgG8" },
  { title: "Video X_xHFi5x1Ps", type: "youtube", embed_url: "https://youtu.be/X_xHFi5x1Ps" },
];

let inserted = 0;
for (const item of items) {
  const { data, error } = await supabase
    .from("media")
    .insert({
      title: item.title,
      type: item.type,
      embed_url: item.embed_url,
      thumbnail: null,
      sort_order: 10 + inserted,
    })
    .select("id");
  if (error) {
    console.error("Failed for", item.embed_url, error.message);
  } else {
    inserted += data?.length ?? 0;
  }
}

console.log(`Done. Inserted/updated ${inserted} media items.`);