import { createPublicClient } from "@/lib/supabase/public";
import { getYouTubeThumbnail } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export const metadata = { title: "Media" };

export default async function Media() {
  const supabase = createPublicClient();
  const { data: items } = await supabase
    .from("media")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">Media</h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-300">
        Videos and educational content.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items && items.length > 0 ? (
          items.map((item) => {
            const thumb = item.thumbnail ?? getYouTubeThumbnail(item.embed_url);
            return (
              <a
                key={item.id}
                href={item.embed_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group aspect-video overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt={item.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-4 text-center text-neutral-500">
                    {item.title}
                  </div>
                )}
              </a>
            );
          })
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400">Media coming soon.</p>
        )}
      </div>
    </div>
  );
}