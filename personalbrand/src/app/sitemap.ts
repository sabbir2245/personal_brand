import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, published_at")
    .eq("is_published", true);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/portfolio`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/education`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/media`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.published_at ?? new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}