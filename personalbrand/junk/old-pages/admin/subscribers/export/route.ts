import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = createServerClient();
  const { data: subscribers } = await supabase.from("subscribers").select("email, status, created_at").order("created_at", { ascending: false });

  const rows = subscribers ?? [];
  const header = "email,status,created_at";
  const csv = [header, ...rows.map((r) => `${r.email},${r.status},${r.created_at ?? ""}`)].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers.csv"`,
    },
  });
}