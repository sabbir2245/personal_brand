import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = createPublicClient();
  const { data } = await supabase.from("portfolio_items").select("title, description").eq("id", id).single();
  return { title: data?.title ?? "Portfolio" };
}

export default async function PortfolioDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createPublicClient();
  const { data: item } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!item) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm uppercase tracking-wide text-neutral-500">
        {item.type === "own" ? "Owned product" : "Client work"}
      </p>
      <h1 className="mt-2 text-3xl font-bold">{item.title}</h1>
      {item.description && <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">{item.description}</p>}

      {item.tech_stack && item.tech_stack.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {item.tech_stack.map((t: string) => (
            <span key={t} className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              {t}
            </span>
          ))}
        </div>
      )}

      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-neutral-900 px-6 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Visit project
        </a>
      )}
    </div>
  );
}