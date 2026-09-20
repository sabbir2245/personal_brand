import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentDoctor } from "@/lib/doctor";
import { PostEditor } from "@/components/admin/post-editor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const doctor = await getCurrentDoctor();
  if (!doctor) redirect("/sign-up");
  if (!doctor.is_onboarded) redirect("/onboarding");

  const { id } = await params;
  const supabase = createServerClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("doctor_id", doctor.id)
    .single();
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit post</h1>
      <PostEditor
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          markdown: post.html_content || "",
          excerpt: post.excerpt ?? "",
          featured_image: post.featured_image ?? "",
          is_published: post.is_published ?? false,
        }}
      />
    </div>
  );
}
