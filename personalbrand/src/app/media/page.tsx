import { createPublicClient } from "@/lib/supabase/public";
import { getYouTubeThumbnail } from "@/lib/youtube";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata = { title: "Videos" };

const hardcodedVideos = [
  {
    id: "7UQsS7hZbg4",
    url: "https://youtu.be/7UQsS7hZbg4",
    title: "Gum disease treatment - Dental hygiene routine - Dental health tips",
  },
  {
    id: "S7frv0tUsLU",
    url: "https://youtu.be/S7frv0tUsLU",
    title: "Gum sensitivity: Causes and remedies for teeth sensitivity",
  },
  {
    id: "GWijqLs1xDE",
    url: "https://youtu.be/GWijqLs1xDE",
    title: "Heart problem symptoms - What signs to look for | Heart Problem Symptoms Bangla",
  },
  {
    id: "cDHkSRWApAc",
    url: "https://youtu.be/cDHkSRWApAc",
    title: "How to get rid of heart disease - Dr Golam Morshed FCPS, MRCP (London)",
  },
  {
    id: "XUXgZt1VNSU",
    url: "https://youtu.be/XUXgZt1VNSU",
    title: "Heart attack symptoms - Heart attack signs - Symptoms of heart attack",
  },
];

export default async function Media() {
  const supabase = createPublicClient();
  const { data: dbVideos } = await supabase
    .from("media")
    .select("*")
    .order("sort_order", { ascending: true });

  const allVideos = [
    ...hardcodedVideos,
    ...(dbVideos?.map((v) => ({
      id: v.id,
      url: v.embed_url,
      title: v.title,
    })) ?? []),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Videos</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Educational videos on dental and heart health.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {allVideos.map((video) => {
          const thumb = getYouTubeThumbnail(video.url);
          return (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card hover className="overflow-hidden p-0">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-4 text-center text-gray-500">
                      {video.title}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {video.title}
                  </h3>
                </div>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}
