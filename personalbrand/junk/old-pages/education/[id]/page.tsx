import { notFound } from "next/navigation";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

export const metadata = { title: "Course" };

const CLASSES = [
  { title: "Introduction & course overview" },
  { title: "Core concepts and fundamentals" },
  { title: "Hands-on project walkthrough" },
  { title: "Advanced techniques & patterns" },
  { title: "Final project, recap & next steps" },
];

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createPublicClient();
  const { data: item } = await supabase.from("education_links").select("*").eq("id", id).maybeSingle();

  if (!item) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Link
        href="/education"
        className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      >
        ← Back to education hub
      </Link>

      <div className="mt-6 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
        <h1 className="text-3xl font-bold">{item.title}</h1>
        {item.description && (
          <p className="mt-3 text-neutral-600 dark:text-neutral-300">{item.description}</p>
        )}
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
          {CLASSES.length} classes
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Course playlist</h2>
        <ol className="mt-4 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {CLASSES.map((cls, i) => (
            <li key={cls.title} className="flex items-center gap-4 p-4 transition hover:bg-neutral-50 dark:hover:bg-neutral-900">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Class {i + 1}</p>
                <h3 className="font-medium">{cls.title}</h3>
              </div>
              <span className="ml-auto shrink-0 rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                Coming soon
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}