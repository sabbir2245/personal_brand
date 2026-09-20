import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentDoctor } from "@/lib/doctor";
import { PortfolioForm } from "@/components/admin/portfolio-form";

export const dynamic = "force-dynamic";

export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const doctor = await getCurrentDoctor();
  if (!doctor) redirect("/sign-up");
  if (!doctor.is_onboarded) redirect("/onboarding");

  const { id } = await params;
  const supabase = createServerClient();
  const { data: item } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("id", id)
    .eq("doctor_id", doctor.id)
    .single();
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit portfolio item</h1>
      <PortfolioForm
        item={{
          id: item.id,
          type: item.type,
          title: item.title,
          description: item.description ?? "",
          url: item.url ?? "",
          image: item.image ?? "",
          tech_stack: (item.tech_stack ?? []).join(", "),
          is_published: item.is_published,
        }}
      />
    </div>
  );
}
