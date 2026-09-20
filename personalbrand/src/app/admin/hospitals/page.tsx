import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentDoctor } from "@/lib/doctor";
import { deleteHospitalAffiliation } from "../actions";

const STATUS_META: Record<string, { label: string; dot: string }> = {
  current: { label: "Currently Working", dot: "bg-green-500" },
  visiting: { label: "Currently Visiting", dot: "bg-yellow-500" },
  former: { label: "Previously Worked", dot: "bg-gray-400" },
};

export default async function HospitalsPage() {
  const doctor = await getCurrentDoctor();
  if (!doctor) redirect("/sign-up");
  if (!doctor.is_onboarded) redirect("/onboarding");

  const supabase = createServerClient();
  const { data: hospitals } = await supabase
    .from("hospital_affiliations")
    .select("*")
    .eq("doctor_id", doctor.id)
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hospital Affiliations</h1>
        <Link
          href="/admin/hospitals/new"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
        >
          Add hospital
        </Link>
      </div>

      <div className="mt-6 grid gap-3">
        {hospitals && hospitals.length > 0 ? (
          hospitals.map((h) => {
            const meta = STATUS_META[h.status] ?? STATUS_META.former;
            return (
              <li
                key={h.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
                style={{ listStyle: "none" }}
              >
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full shrink-0 ${meta.dot}`} />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{h.name}</p>
                    <span className="mt-1 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {meta.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Order: {h.sort_order}</span>
                  <Link
                    href={`/admin/hospitals/${h.id}`}
                    className="rounded-lg border-2 border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-all hover:border-blue-300 hover:text-blue-600 hover:shadow-sm dark:border-gray-700 dark:text-gray-400"
                  >
                    Edit
                  </Link>
                  <form action={deleteHospitalAffiliation}>
                    <input type="hidden" name="id" value={h.id} />
                    <button
                      type="submit"
                      className="rounded-lg border-2 border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition-all hover:bg-red-50 hover:border-red-300 hover:shadow-sm dark:border-red-900 dark:hover:bg-red-950"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </li>
            );
          })
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No affiliations yet.</p>
        )}
      </div>
    </div>
  );
}
