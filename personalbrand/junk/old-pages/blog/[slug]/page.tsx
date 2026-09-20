import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (!data) return { title: "Not found" };
  return {
    title: data.title,
    description: data.excerpt ?? undefined,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createPublicClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      {post.featured_image && (
        <div className="mb-8 overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featured_image}
            alt={post.title}
            className="aspect-video w-full object-cover"
          />
        </div>
      )}
      <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
      {post.published_at && (
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
          {new Date(post.published_at).toLocaleDateString()}
        </p>
      )}
      {post.excerpt && (
        <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-300">{post.excerpt}</p>
      )}
      <div
        className="prose prose-neutral mt-8 max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.html_content }}
      />
    </article>
  );
}