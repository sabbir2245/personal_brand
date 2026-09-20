import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog",
};

export default async function BlogIndex() {
  const supabase = createPublicClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">Articles</h1>
      <div className="mt-8 grid gap-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col md:flex-row gap-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs transition-all duration-300 ease-out hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-teal-400/40 hover:bg-neutral-50/10"
            >
              {post.featured_image && (
                <div className="h-40 w-full md:w-60 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold leading-snug text-neutral-900 transition-colors duration-300 group-hover:text-teal-700 dark:text-neutral-100 dark:group-hover:text-teal-400">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  <span>
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Draft"}
                  </span>
                  <span className="font-medium text-teal-700 transition-all duration-300 dark:text-teal-400 flex items-center gap-0.5 group-hover:gap-1.5">
                    Read article <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400">No posts yet.</p>
        )}
      </div>
    </div>
  );
}