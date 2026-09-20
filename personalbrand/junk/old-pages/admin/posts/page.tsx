import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { deletePost, publishPost, unpublishPost } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminPosts() {
  const supabase = createServerClient();
  const { data: posts } = await supabase.from("posts").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          New post
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id} className="border-t border-neutral-200 dark:border-neutral-800">
                  <td className="px-4 py-3 font-medium">{post.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        post.is_published
                          ? "rounded-full bg-green-100 px-2.5 py-1 text-xs text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                      }
                    >
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/posts/${post.id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                        Edit
                      </Link>
                      <form action={post.is_published ? unpublishPost : publishPost}>
                        <input type="hidden" name="id" value={post.id} />
                        <button className="text-neutral-600 hover:underline dark:text-neutral-300">
                          {post.is_published ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form action={deletePost}>
                        <input type="hidden" name="id" value={post.id} />
                        <button className="text-red-600 hover:underline dark:text-red-400">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400">
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}