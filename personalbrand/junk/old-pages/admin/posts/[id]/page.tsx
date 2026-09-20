import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { PostEditor } from "@/components/admin/post-editor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data: post } = await supabase.from("posts").select("*").eq("id", id).single();
  if (!post) notFound();

  const markdown = await rawMarkdown(post.html_content);

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit post</h1>
      <PostEditor
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          markdown,
          excerpt: post.excerpt ?? "",
          featured_image: post.featured_image ?? "",
          is_published: post.is_published ?? false,
        }}
      />
    </div>
  );
}

async function rawMarkdown(html: string): Promise<string> {
  // We store HTML; for editing we keep it as plain text fallback to avoid
  // lossy HTML->Markdown conversion. Users can paste Markdown here and it
  // will be re-rendered on save.
  return html || "";
}