import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentDoctor } from "@/lib/doctor";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const doctor = await getCurrentDoctor();
  if (!doctor) redirect("/sign-up");
  if (!doctor.is_onboarded) redirect("/onboarding");

  const supabase = createServerClient();

  const [posts, subs, msgs, portfolio] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact" }).eq("doctor_id", doctor.id),
    supabase.from("subscribers").select("id, status"),
    supabase.from("messages").select("id", { count: "exact" }).eq("doctor_id", doctor.id),
    supabase.from("portfolio_items").select("id", { count: "exact" }).eq("doctor_id", doctor.id),
  ]);

  const totalSubs = subs.data?.length ?? 0;
  const activeSubs = subs.data?.filter((s) => s.status === "active").length ?? 0;

  const cards = [
    { label: "Posts", value: posts.count ?? 0, href: "/admin/posts", color: "text-blue-600 dark:text-blue-400" },
    { label: "Active subscribers", value: activeSubs, href: "/admin/subscribers", color: "text-green-600 dark:text-green-400" },
    { label: "Total subscribers", value: totalSubs, href: "/admin/subscribers", color: "text-purple-600 dark:text-purple-400" },
    { label: "Messages", value: msgs.count ?? 0, href: "/admin/analytics", color: "text-orange-600 dark:text-orange-400" },
    { label: "Portfolio items", value: portfolio.count ?? 0, href: "/admin/portfolio", color: "text-pink-600 dark:text-pink-400" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Your site: <Link href={`/${doctor.slug}`} className="text-blue-600 hover:underline dark:text-blue-400">{doctor.slug}.yourdomain.com</Link>
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{c.label}</p>
            <p className={`mt-1 text-3xl font-bold ${c.color}`}>{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
