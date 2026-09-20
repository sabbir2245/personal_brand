import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { EducationForm } from "@/components/admin/education-form";

export const dynamic = "force-dynamic";

export default async function EditEducationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data: item } = await supabase.from("education_links").select("*").eq("id", id).single();
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit education link</h1>
      <EducationForm
        item={{
          id: item.id,
          title: item.title,
          description: item.description ?? "",
          url: item.url ?? "",
          sort_order: item.sort_order ?? 0,
        }}
      />
    </div>
  );
}