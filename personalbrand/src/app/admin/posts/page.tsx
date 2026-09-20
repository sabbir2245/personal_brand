import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentDoctor } from "@/lib/doctor";
import { deletePost, publishPost, unpublishPost } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminPosts() {
  const doctor = await getCurrentDoctor();
  if (!doctor) redirect("/sign-up");
  if (!doctor.is_onboarded) redirect("/onboarding");

  const supabase = createServerClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("doctor_id", doctor.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
        >
          New post
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{post.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        post.is_published
                          ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      }
                    >
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/posts/${post.id}`} className="font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400">
                        Edit
                      </Link>
                      <form action={post.is_published ? unpublishPost : publishPost}>
                        <input type="hidden" name="id" value={post.id} />
                        <button className="font-semibold text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-300">
                          {post.is_published ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form action={deletePost}>
                        <input type="hidden" name="id" value={post.id} />
                        <button className="font-semibold text-red-600 hover:text-red-700 hover:underline dark:text-red-400">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
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
