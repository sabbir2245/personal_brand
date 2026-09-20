import { redirect } from "next/navigation";
import { getCurrentDoctor } from "@/lib/doctor";
import { EducationForm } from "@/components/admin/education-form";

export const dynamic = "force-dynamic";

export default async function NewEducationPage() {
  const doctor = await getCurrentDoctor();
  if (!doctor) redirect("/sign-up");
  if (!doctor.is_onboarded) redirect("/onboarding");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New education link</h1>
      <EducationForm item={{ title: "", description: "", url: "", sort_order: 0 }} />
    </div>
  );
}
