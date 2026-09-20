import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { unsubscribeSubscriber, deleteSubscriber, addSubscriber } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminSubscribers() {
  const supabase = createServerClient();
  const { data: subscribers } = await supabase.from("subscribers").select("*").order("created_at", { ascending: false });

  const counts = (subscribers ?? []).reduce<Record<string, number>>((acc, s) => {
    acc[s.status] = (acc[s.status] ?? 0) + 1;
    return acc;
  }, {});

  const statusStyles: Record<string, string> = {
    active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    unsubscribed: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
    bounced: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subscribers</h1>
        <div className="flex gap-2">
          <a
            href="/admin/subscribers/export"
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Export CSV
          </a>
        </div>
      </div>

      <form action={addSubscriber} className="mt-6 flex max-w-md items-center gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="new@example.com"
          className="flex-1 rounded-full border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        <button className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300">
          Add subscriber
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-4">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <p className="text-sm text-neutral-500 capitalize dark:text-neutral-400">{status}</p>
            <p className="mt-1 text-2xl font-bold">{count}</p>
          </div>
        ))}
        {Object.keys(counts).length === 0 && (
          <p className="text-neutral-500 dark:text-neutral-400">No subscribers yet.</p>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
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
                <tr key={s.id} className="border-t border-neutral-200 dark:border-neutral-800">
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${statusStyles[s.status] ?? ""}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                    {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {s.status === "active" && (
                        <form action={unsubscribeSubscriber}>
                          <input type="hidden" name="id" value={s.id} />
                          <button className="text-neutral-600 hover:underline dark:text-neutral-300">Unsubscribe</button>
                        </form>
                      )}
                      <form action={deleteSubscriber}>
                        <input type="hidden" name="id" value={s.id} />
                        <button className="text-red-600 hover:underline dark:text-red-400">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400">
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
        Tip: subscribe via the <Link href="/" className="underline">newsletter form</Link> to add real data.
      </p>
    </div>
  );
}