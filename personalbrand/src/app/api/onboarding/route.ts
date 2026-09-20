import { NextRequest, NextResponse } from "next/server";
import { getCurrentDoctor } from "@/lib/doctor";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const {
      slug,
      display_name,
      site_name,
      doctor_name,
      doctor_title,
      doctor_qualifications,
      doctor_photo_url,
      doctor_about,
      doctor_bmdc_id,
      doctor_location,
      contact_email,
    } = body;

    // Validate slug format
    if (!slug || !/^[a-z0-9\-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "Invalid slug. Use only lowercase letters, numbers, and hyphens." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Check if slug is already taken by another doctor
    const { data: existingSlug } = await supabase
      .from("doctors")
      .select("id")
      .eq("slug", slug)
      .neq("id", doctor.id)
      .maybeSingle();

    if (existingSlug) {
      return NextResponse.json(
        { error: "This slug is already taken. Please choose another." },
        { status: 400 }
      );
    }

    // Update doctor profile
    const { error: doctorError } = await supabase
      .from("doctors")
      .update({
        slug,
        display_name,
        is_onboarded: true,
      })
      .eq("id", doctor.id);

    if (doctorError) {
      return NextResponse.json({ error: doctorError.message }, { status: 500 });
    }

    // Check if settings already exist
    const { data: existingSettings } = await supabase
      .from("site_settings")
      .select("id")
      .eq("doctor_id", doctor.id)
      .maybeSingle();

    const settingsPayload = {
      doctor_id: doctor.id,
      site_name: site_name || display_name,
      tagline: doctor_title || "",
      hero_headline: doctor_title || "",
      hero_subtitle: doctor_about || "",
      contact_email: contact_email || "",
      doctor_name: doctor_name || display_name,
      doctor_title,
      doctor_qualifications,
      doctor_photo_url,
      doctor_about,
      doctor_bmdc_id,
      doctor_location,
      doctor_services: "[]" as unknown as Record<string, unknown>[],
      social_links: {} as Record<string, unknown>,
      theme_colors: {} as Record<string, unknown>,
    };

    if (existingSettings) {
      await supabase
        .from("site_settings")
        .update(settingsPayload)
        .eq("id", existingSettings.id);
    } else {
      await supabase.from("site_settings").insert(settingsPayload);
    }

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
