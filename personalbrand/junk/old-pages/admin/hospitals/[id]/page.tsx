import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { HospitalAffiliationForm } from "@/components/admin/hospital-affiliations-form";
import Link from "next/link";

export default async function EditHospitalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data: hospital } = await supabase
    .from("hospital_affiliations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!hospital) notFound();

  return (
    <div>
      <Link
        href="/admin/hospitals"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors mb-6"
      >
        ← Back to Hospitals
      </Link>

      <div className="section-badge w-fit mb-2">
        <span className="dot" />
        <span className="label">Edit</span>
      </div>
      <h1
        className="text-2xl font-semibold text-[var(--foreground)]"
        style={{ fontFamily: "'Calistoga', Georgia, serif" }}
      >
        Edit <span className="gradient-text">Affiliation</span>
      </h1>

      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]">
        <HospitalAffiliationForm
          hospital={{
            id: hospital.id,
            name: hospital.name,
            status: hospital.status,
            sort_order: hospital.sort_order,
          }}
        />
      </div>
    </div>
  );
}
