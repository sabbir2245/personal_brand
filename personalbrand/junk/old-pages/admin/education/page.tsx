import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { deleteEducation } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminEducation() {
  const supabase = createServerClient();
  const { data: items } = await supabase.from("education_links").select("*").order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Education</h1>
        <Link
          href="/admin/education/new"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          New link
        </Link>
      </div>

      <div className="mt-6 grid gap-4">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
              <div>
                <p className="font-semibold">{item.title}</p>
                {item.description && <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Link href={`/admin/education/${item.id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                  Edit
                </Link>
                <form action={deleteEducation}>
                  <input type="hidden" name="id" value={item.id} />
                  <button className="text-red-600 hover:underline dark:text-red-400">Delete</button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400">No education links yet.</p>
        )}
      </div>
    </div>
  );
}