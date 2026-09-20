import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { HospitalAffiliationForm } from "@/components/admin/hospital-affiliations-form";

export const dynamic = "force-dynamic";

export default async function EditHospitalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data: hospital } = await supabase.from("hospital_affiliations").select("*").eq("id", id).single();
  if (!hospital) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit hospital affiliation</h1>
      <HospitalAffiliationForm
        hospital={{
          id: hospital.id,
          name: hospital.name,
          status: hospital.status,
          sort_order: hospital.sort_order ?? 0,
        }}
      />
    </div>
  );
}
