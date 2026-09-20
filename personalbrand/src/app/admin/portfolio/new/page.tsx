import { redirect } from "next/navigation";
import { getCurrentDoctor } from "@/lib/doctor";
import { PortfolioForm } from "@/components/admin/portfolio-form";

export const dynamic = "force-dynamic";

export default async function NewPortfolioPage() {
  const doctor = await getCurrentDoctor();
  if (!doctor) redirect("/sign-up");
  if (!doctor.is_onboarded) redirect("/onboarding");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New portfolio item</h1>
      <PortfolioForm item={{ type: "own", title: "", description: "", url: "", image: "", tech_stack: "" }} />
    </div>
  );
}
