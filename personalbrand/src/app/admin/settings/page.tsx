import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentDoctor } from "@/lib/doctor";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  const doctor = await getCurrentDoctor();
  if (!doctor) redirect("/sign-up");
  if (!doctor.is_onboarded) redirect("/onboarding");

  const supabase = createServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("doctor_id", doctor.id)
    .maybeSingle();

  const s = data;
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Site settings</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Your slug: <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">{doctor.slug}</code>
      </p>
      <SettingsForm
        settings={{
          site_name: s?.site_name ?? "",
          tagline: s?.tagline ?? "",
          hero_headline: s?.hero_headline ?? "",
          hero_subtitle: s?.hero_subtitle ?? "",
          contact_email: s?.contact_email ?? "",
          social_links: JSON.stringify(s?.social_links ?? {}, null, 2),
          theme_colors: JSON.stringify(s?.theme_colors ?? {}, null, 2),
          doctor_name: s?.doctor_name ?? "",
          doctor_title: s?.doctor_title ?? "",
          doctor_qualifications: s?.doctor_qualifications ?? "",
          doctor_photo_url: s?.doctor_photo_url ?? "",
          doctor_about: s?.doctor_about ?? "",
          doctor_services: JSON.stringify(s?.doctor_services ?? [], null, 2),
          doctor_bmdc_id: s?.doctor_bmdc_id ?? "",
          doctor_location: s?.doctor_location ?? "",
        }}
      />
    </div>
  );
}
