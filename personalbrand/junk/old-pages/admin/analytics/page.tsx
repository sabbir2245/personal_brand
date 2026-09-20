import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminAnalytics() {
  const supabase = createServerClient();

  const [analytics, subscribers] = await Promise.all([
    supabase.from("email_analytics").select("*"),
    supabase.from("subscribers").select("id, status"),
  ]);

  const events = analytics.data ?? [];
  const counts = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.event] = (acc[e.event] ?? 0) + 1;
    return acc;
  }, {});

  const totalSubs = subscribers.data?.length ?? 0;
  const openRate = totalSubs > 0 ? Math.round(((counts.open ?? 0) / totalSubs) * 100) : 0;

  const eventCards = [
    { label: "Opens", value: counts.open ?? 0 },
    { label: "Clicks", value: counts.click ?? 0 },
    { label: "Bounces", value: counts.bounce ?? 0 },
    { label: "Est. open rate", value: `${openRate}%` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        Based on Resend webhook events recorded in <code>email_analytics</code>.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {eventCards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{c.label}</p>
            <p className="mt-1 text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Recent events</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                [...events]
                  .sort((a, b) => (b.occurred_at ?? "").localeCompare(a.occurred_at ?? ""))
                  .slice(0, 20)
                  .map((e) => (
                    <tr key={e.id} className="border-t border-neutral-200 dark:border-neutral-800">
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs capitalize dark:bg-neutral-800">
                          {e.event}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                        {e.occurred_at ? new Date(e.occurred_at).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400">
                    No events yet. They appear after emails are opened/clicked (Resend webhook).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}