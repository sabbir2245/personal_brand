import { createPublicClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

export const metadata = { title: "Education" };

export default async function Education() {
  const supabase = createPublicClient();
  const { data: items } = await supabase
    .from("education_links")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">Education</h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-300">
        Qualifications and professional training.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800"
            >
              <h2 className="text-lg font-semibold">{item.title}</h2>
              {item.description && (
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400">Courses coming soon.</p>
        )}
      </div>
    </div>
  );
}