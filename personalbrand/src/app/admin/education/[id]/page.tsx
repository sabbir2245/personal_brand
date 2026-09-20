import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentDoctor } from "@/lib/doctor";
import { EducationForm } from "@/components/admin/education-form";

export const dynamic = "force-dynamic";

export default async function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
  const doctor = await getCurrentDoctor();
  if (!doctor) redirect("/sign-up");
  if (!doctor.is_onboarded) redirect("/onboarding");

  const { id } = await params;
  const supabase = createServerClient();
  const { data: item } = await supabase
    .from("education_links")
    .select("*")
    .eq("id", id)
    .eq("doctor_id", doctor.id)
    .single();
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit education link</h1>
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
