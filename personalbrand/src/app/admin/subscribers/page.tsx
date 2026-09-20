import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentDoctor } from "@/lib/doctor";
import { unsubscribeSubscriber, deleteSubscriber, addSubscriber } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminSubscribers() {
  const doctor = await getCurrentDoctor();
  if (!doctor) redirect("/sign-up");
  if (!doctor.is_onboarded) redirect("/onboarding");

  const supabase = createServerClient();
  const { data: subscribers } = await supabase.from("subscribers").select("*").order("created_at", { ascending: false });

  const counts = (subscribers ?? []).reduce<Record<string, number>>((acc, s) => {
    acc[s.status] = (acc[s.status] ?? 0) + 1;
    return acc;
  }, {});

  const statusStyles: Record<string, string> = {
    active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    unsubscribed: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    bounced: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscribers</h1>
        <a
          href="/admin/subscribers/export"
          className="rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >
          Export CSV
        </a>
      </div>

      <form action={addSubscriber} className="mt-6 flex max-w-md items-center gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="new@example.com"
          className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
        <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5">
          Add subscriber
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-4">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 capitalize dark:text-gray-400">{status}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
          </div>
        ))}
        {Object.keys(counts).length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">No subscribers yet.</p>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers && subscribers.length > 0 ? (
              subscribers.map((s) => (
                <tr key={s.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{s.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[s.status] ?? ""}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {s.status === "active" && (
                        <form action={unsubscribeSubscriber}>
                          <input type="hidden" name="id" value={s.id} />
                          <button className="text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-300 dark:hover:text-white">Unsubscribe</button>
                        </form>
                      )}
                      <form action={deleteSubscriber}>
                        <input type="hidden" name="id" value={s.id} />
                        <button className="text-red-600 hover:text-red-700 hover:underline dark:text-red-400">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
