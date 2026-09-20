import { PostEditor } from "@/components/admin/post-editor";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New post</h1>
      <PostEditor post={{ title: "", slug: "", markdown: "", excerpt: "", featured_image: "" }} />
    </div>
  );
}