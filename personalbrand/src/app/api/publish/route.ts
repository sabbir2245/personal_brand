import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { dispatchPostToSubscribers } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { id?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json({ error: "post id is required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id, title, slug, html_content, excerpt")
    .eq("id", id)
    .single();
  if (postError || !post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const { error: pubError } = await supabase
    .from("posts")
    .update({ is_published: true, published_at: new Date().toISOString() })
    .eq("id", id);
  if (pubError) {
    return NextResponse.json({ error: pubError.message }, { status: 500 });
  }

  const result = await dispatchPostToSubscribers(post);

  return NextResponse.json({
    ok: true,
    published: true,
    dispatched: result.dispatched,
    totalRecipients: result.total,
    recipients: result.recipients,
  });
}