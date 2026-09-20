import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const email = new URL(req.url).searchParams.get("email")?.trim().toLowerCase() ?? "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from("subscribers")
    .update({ status: "unsubscribed" })
    .eq("email", email);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "You've been unsubscribed" });
}