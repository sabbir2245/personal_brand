import { createServerClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  const supabase = createServerClient();
  const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();

  const s = data;
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Site settings</h1>
      <SettingsForm
        settings={{
          site_name: s?.site_name ?? "",
          tagline: s?.tagline ?? "",
          hero_headline: s?.hero_headline ?? "",
          hero_subtitle: s?.hero_subtitle ?? "",
          contact_email: s?.contact_email ?? "",
          social_links: JSON.stringify(s?.social_links ?? {}, null, 2),
          theme_colors: JSON.stringify(s?.theme_colors ?? {}, null, 2),
        }}
      />
    </div>
  );
}