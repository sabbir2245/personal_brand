import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { HospitalAffiliationForm } from "@/components/admin/hospital-affiliations-form";
import { deleteHospitalAffiliation } from "../actions";

const STATUS_META: Record<string, { label: string; dot: string; badge: string }> = {
  current: {
    label: "Currently Working",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-400",
  },
  visiting: {
    label: "Currently Visiting",
    dot: "bg-yellow-500",
    badge: "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-400",
  },
  former: {
    label: "Previously Worked",
    dot: "bg-[var(--muted-foreground)]",
    badge: "bg-[var(--muted)] border-[var(--border)] text-[var(--muted-foreground)]",
  },
};

export default async function HospitalsPage() {
  const supabase = createServerClient();
  const { data: hospitals } = await supabase
    .from("hospital_affiliations")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <div className="section-badge w-fit mb-2">
            <span className="dot" />
            <span className="label">Admin</span>
          </div>
          <h1
            className="text-2xl font-semibold text-[var(--foreground)]"
            style={{ fontFamily: "'Calistoga', Georgia, serif" }}
          >
            Hospital <span className="gradient-text">Affiliations</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Manage hospitals — entries appear as pills in the site header and on the homepage.
          </p>
        </div>
      </div>

      {/* Add new */}
      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]">
        <h2 className="font-semibold text-[var(--foreground)]">Add New Hospital</h2>
        <HospitalAffiliationForm
          hospital={{ name: "", status: "current", sort_order: 0 }}
        />
      </div>

      {/* Existing list */}
      <div className="mt-8">
        <h2 className="font-semibold text-[var(--foreground)] mb-4">
          Existing Affiliations
          <span className="ml-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-2 py-0.5 text-xs font-normal text-[var(--muted-foreground)]">
            {hospitals?.length ?? 0}
          </span>
        </h2>

        {hospitals && hospitals.length > 0 ? (
          <ul className="grid gap-3">
            {hospitals.map((h) => {
              const meta = STATUS_META[h.status] ?? STATUS_META.former;
              return (
                <li
                  key={h.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-[var(--shadow-sm)]"
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${meta.dot}`} />
                    <div>
                      <p className="font-medium text-[var(--foreground)]">{h.name}</p>
                      <span className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${meta.badge}`}>
                        {meta.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--muted-foreground)]">Order: {h.sort_order}</span>
                    <Link
                      href={`/admin/hospitals/${h.id}`}
                      className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] transition-all duration-200 hover:border-[rgba(0,82,255,0.3)] hover:text-[var(--accent)]"
                    >
                      Edit
                    </Link>
                    <form action={deleteHospitalAffiliation}>
                      <input type="hidden" name="id" value={h.id} />
                      <button
                        type="submit"
                        className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-all duration-200 hover:bg-red-50 hover:border-red-300 dark:border-red-900 dark:hover:bg-red-950"
                        onClick={(e) => {
                          if (!confirm(`Remove "${h.name}"?`)) e.preventDefault();
                        }}
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-accent text-white shadow-[var(--shadow-accent)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[var(--foreground)]">No affiliations yet</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Add your first hospital using the form above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
