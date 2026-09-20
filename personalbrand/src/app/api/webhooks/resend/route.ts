import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type ResendEvent = {
  type: string;
  data?: {
    to?: string[];
    email_id?: string;
    click?: { url?: string };
  };
};

const EVENT_MAP: Record<string, "open" | "click" | "bounce"> = {
  "email.opened": "open",
  "email.clicked": "click",
  "email.bounced": "bounce",
};

export async function POST(req: Request) {
  let events: ResendEvent[];
  try {
    events = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!Array.isArray(events)) {
    return NextResponse.json({ error: "Expected an array of events" }, { status: 400 });
  }

  const supabase = createServerClient();

  for (const event of events) {
    const analyticsEvent = EVENT_MAP[event.type];
    if (!analyticsEvent) continue;

    const recipient = event.data?.to?.[0];
    if (!recipient) continue;

    const { data: sub } = await supabase
      .from("subscribers")
      .select("id")
      .eq("email", recipient)
      .maybeSingle();
    if (!sub) continue;

    await supabase.from("email_analytics").insert({
      subscription_id: sub.id,
      event: analyticsEvent,
    });

    if (analyticsEvent === "bounce") {
      await supabase
        .from("subscribers")
        .update({ status: "bounced" })
        .eq("id", sub.id);
    }
  }

  return NextResponse.json({ ok: true });
}