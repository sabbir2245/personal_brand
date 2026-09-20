import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentDoctor } from "@/lib/doctor";
import { deletePortfolio } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminPortfolio() {
  const doctor = await getCurrentDoctor();
  if (!doctor) redirect("/sign-up");
  if (!doctor.is_onboarded) redirect("/onboarding");

  const supabase = createServerClient();
  const { data: items } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("doctor_id", doctor.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
        <Link
          href="/admin/portfolio/new"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
        >
          New item
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {item.type === "own" ? "Owned" : "Client"}
                </span>
                <span
                  className={
                    item.is_published
                      ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  }
                >
                  {item.is_published ? "Published" : "Draft"}
                </span>
              </div>
              <h2 className="mt-3 font-bold text-gray-900 dark:text-white">{item.title}</h2>
              {item.description && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>}
              <div className="mt-4 flex items-center gap-3 text-sm">
                <Link href={`/admin/portfolio/${item.id}`} className="font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400">
                  Edit
                </Link>
                <form action={deletePortfolio}>
                  <input type="hidden" name="id" value={item.id} />
                  <button className="font-semibold text-red-600 hover:text-red-700 hover:underline dark:text-red-400">Delete</button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No portfolio items yet.</p>
        )}
      </div>
    </div>
  );
}
