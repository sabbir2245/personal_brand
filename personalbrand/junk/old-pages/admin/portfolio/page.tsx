import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { deletePortfolio } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminPortfolio() {
  const supabase = createServerClient();
  const { data: items } = await supabase.from("portfolio_items").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <Link
          href="/admin/portfolio/new"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          New item
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                  {item.type === "own" ? "Owned" : "Client"}
                </span>
                <span
                  className={
                    item.is_published
                      ? "rounded-full bg-green-100 px-2.5 py-1 text-xs text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                  }
                >
                  {item.is_published ? "Published" : "Draft"}
                </span>
              </div>
              <h2 className="mt-3 font-semibold">{item.title}</h2>
              {item.description && <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>}
              <div className="mt-4 flex items-center gap-3 text-sm">
                <Link href={`/admin/portfolio/${item.id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                  Edit
                </Link>
                <form action={deletePortfolio}>
                  <input type="hidden" name="id" value={item.id} />
                  <button className="text-red-600 hover:underline dark:text-red-400">Delete</button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400">No portfolio items yet.</p>
        )}
      </div>
    </div>
  );
}