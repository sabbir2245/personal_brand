import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "lead magnet id is required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data: magnet, error } = await supabase
    .from("lead_magnets")
    .select("id, title, file_url, download_count")
    .eq("id", id)
    .single();

  if (error || !magnet?.file_url) {
    return NextResponse.json({ error: "Lead magnet not found" }, { status: 404 });
  }

  await supabase
    .from("lead_magnets")
    .update({ download_count: (magnet.download_count ?? 0) + 1 })
    .eq("id", id);

  return NextResponse.redirect(magnet.file_url);
}