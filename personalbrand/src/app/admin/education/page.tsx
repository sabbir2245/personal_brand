import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentDoctor } from "@/lib/doctor";
import { deleteEducation } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminEducation() {
  const doctor = await getCurrentDoctor();
  if (!doctor) redirect("/sign-up");
  if (!doctor.is_onboarded) redirect("/onboarding");

  const supabase = createServerClient();
  const { data: items } = await supabase
    .from("education_links")
    .select("*")
    .eq("doctor_id", doctor.id)
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h1>
        <Link
          href="/admin/education/new"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
        >
          New link
        </Link>
      </div>

      <div className="mt-6 grid gap-4">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{item.title}</p>
                {item.description && <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Link href={`/admin/education/${item.id}`} className="font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400">
                  Edit
                </Link>
                <form action={deleteEducation}>
                  <input type="hidden" name="id" value={item.id} />
                  <button className="font-semibold text-red-600 hover:text-red-700 hover:underline dark:text-red-400">Delete</button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No education links yet.</p>
        )}
      </div>
    </div>
  );
}
