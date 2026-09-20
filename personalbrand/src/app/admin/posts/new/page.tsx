import { redirect } from "next/navigation";
import { getCurrentDoctor } from "@/lib/doctor";
import { PostEditor } from "@/components/admin/post-editor";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const doctor = await getCurrentDoctor();
  if (!doctor) redirect("/sign-up");
  if (!doctor.is_onboarded) redirect("/onboarding");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New post</h1>
      <PostEditor post={{ title: "", slug: "", markdown: "", excerpt: "", featured_image: "" }} />
    </div>
  );
}
