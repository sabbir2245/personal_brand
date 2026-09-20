import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE env vars");
  process.exit(1);
}

const supabase = createClient(url, key);

const emails = [
  "alice@example.com",
  "bob@example.com",
  "carol@example.com",
  "dave@example.com",
  "erin@example.com",
  "frank@example.com",
  "grace@example.com",
  "heidi@example.com",
  "ivan@example.com",
];

let inserted = 0;
let updated = 0;
for (const email of emails) {
  const { data, error } = await supabase
    .from("subscribers")
    .upsert({ email, status: "active" }, { onConflict: "email" })
    .select("id");
  if (error) {
    console.error("Failed for", email, error.message);
  } else if (data?.length) {
    inserted++;
  } else {
    updated++;
  }
}

console.log(`Done. Inserted ${inserted}, already-present ${updated} fake subscribers.`);