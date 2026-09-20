import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentDoctor } from "@/lib/doctor";
import { getYouTubeThumbnail } from "@/lib/youtube";
import { addMedia, deleteMedia } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminMedia() {
  const doctor = await getCurrentDoctor();
  if (!doctor) redirect("/sign-up");
  if (!doctor.is_onboarded) redirect("/onboarding");

  const supabase = createServerClient();
  const { data: items } = await supabase
    .from("media")
    .select("*")
    .eq("doctor_id", doctor.id)
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Management</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Add or remove YouTube videos from the site.
      </p>

      <form action={addMedia} className="mt-6 grid gap-4 rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
        <h2 className="font-bold text-gray-900 dark:text-white">Add New Video</h2>
        <input
          type="url"
          name="url"
          required
          placeholder="https://youtu.be/..."
          className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
        />
        <input
          type="text"
          name="title"
          required
          placeholder="Video title"
          className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
        />
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
        >
          Add Video
        </button>
      </form>

      <div className="mt-8">
        <h2 className="font-bold text-gray-900 dark:text-white">Existing Videos</h2>
        <div className="mt-4 grid gap-4">
          {items && items.length > 0 ? (
            items.map((item) => {
              const thumb = getYouTubeThumbnail(item.embed_url);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
                >
                  <div className="h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-500">No thumb</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-gray-900 dark:text-white">{item.title}</p>
                    <p className="mt-1 truncate text-xs text-gray-500">{item.embed_url}</p>
                  </div>
                  <form action={deleteMedia}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="rounded-lg border-2 border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 hover:border-red-300 hover:shadow-sm dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">
                      Remove
                    </button>
                  </form>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">No videos added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
