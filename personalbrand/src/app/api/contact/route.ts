import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { name?: unknown; email?: unknown; message?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "name, email and message are required" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { error } = await supabase.from("messages").insert({ name, email, message });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Message received" }, { status: 201 });
}