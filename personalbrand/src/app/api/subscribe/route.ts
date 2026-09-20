import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { email?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data: existing } = await supabase
    .from("subscribers")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    if (existing.status === "active") {
      return NextResponse.json({ ok: true, message: "Already subscribed" });
    }
    const { error } = await supabase
      .from("subscribers")
      .update({ status: "active" })
      .eq("id", existing.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, message: "Resubscribed" });
  }

  const { error } = await supabase
    .from("subscribers")
    .insert({ email });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { error: emailError } = await sendWelcomeEmail(email);
  if (emailError) {
    console.error("Welcome email failed:", emailError);
  }

  return NextResponse.json({ ok: true, message: "Subscribed" }, { status: 201 });
}