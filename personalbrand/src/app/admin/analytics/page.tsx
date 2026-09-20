import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentDoctor } from "@/lib/doctor";

export const dynamic = "force-dynamic";

export default async function AdminAnalytics() {
  const doctor = await getCurrentDoctor();
  if (!doctor) redirect("/sign-up");
  if (!doctor.is_onboarded) redirect("/onboarding");

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
    { label: "Opens", value: counts.open ?? 0, color: "text-blue-600 dark:text-blue-400" },
    { label: "Clicks", value: counts.click ?? 0, color: "text-green-600 dark:text-green-400" },
    { label: "Bounces", value: counts.bounce ?? 0, color: "text-red-600 dark:text-red-400" },
    { label: "Est. open rate", value: `${openRate}%`, color: "text-purple-600 dark:text-purple-400" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Based on Resend webhook events recorded in <code>email_analytics</code>.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {eventCards.map((c) => (
          <div key={c.label} className="rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">{c.label}</p>
            <p className={`mt-1 text-3xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent events</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
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
                    <tr key={e.id} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium capitalize text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          {e.event}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {e.occurred_at ? new Date(e.occurred_at).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No events yet.
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
