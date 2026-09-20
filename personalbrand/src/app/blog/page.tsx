import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata = { title: "Articles" };

export default async function BlogIndex() {
  const supabase = createPublicClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Articles</h1>
      <div className="mt-8 grid gap-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card hover className="flex flex-col md:flex-row gap-6">
                {post.featured_image && (
                  <div className="h-40 w-full md:w-60 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{post.title}</h2>
                    {post.excerpt && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{post.excerpt}</p>
                    )}
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Draft"}
                  </div>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
