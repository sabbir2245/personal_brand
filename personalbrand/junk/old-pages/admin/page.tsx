import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const supabase = createServerClient();

  const [posts, subs, msgs, portfolio] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact" }),
    supabase.from("subscribers").select("id, status"),
    supabase.from("messages").select("id", { count: "exact" }),
    supabase.from("portfolio_items").select("id", { count: "exact" }),
  ]);

  const totalSubs = subs.data?.length ?? 0;
  const activeSubs = subs.data?.filter((s) => s.status === "active").length ?? 0;

  const cards = [
    { label: "Posts", value: posts.count ?? 0, href: "/admin/posts" },
    { label: "Active subscribers", value: activeSubs, href: "/admin/subscribers" },
    { label: "Total subscribers", value: totalSubs, href: "/admin/subscribers" },
    { label: "Messages", value: msgs.count ?? 0, href: "/admin/analytics" },
    { label: "Portfolio items", value: portfolio.count ?? 0, href: "/admin/portfolio" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-neutral-200 p-5 transition hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
          >
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{c.label}</p>
            <p className="mt-1 text-3xl font-bold">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}