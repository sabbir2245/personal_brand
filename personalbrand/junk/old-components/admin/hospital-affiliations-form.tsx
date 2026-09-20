"use client";

import { useState } from "react";
import { saveHospitalAffiliation } from "@/app/admin/actions";

type HospitalAffiliation = {
  id?: string;
  name: string;
  status: "current" | "visiting" | "former";
  sort_order: number;
};

const STATUS_OPTIONS = [
  { value: "current", label: "Currently Working", color: "text-emerald-600 dark:text-emerald-400" },
  { value: "visiting", label: "Currently Visiting", color: "text-yellow-600 dark:text-yellow-400" },
  { value: "former", label: "Previously Worked", color: "text-[var(--muted-foreground)]" },
];

const inputClass =
  "rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(0,82,255,0.15)] dark:bg-[var(--muted)] dark:text-[var(--foreground)]";

export function HospitalAffiliationForm({ hospital }: { hospital: HospitalAffiliation }) {
  const [form, setForm] = useState(hospital);

  return (
    <form action={saveHospitalAffiliation} className="mt-4 grid gap-4">
      {form.id && <input type="hidden" name="id" value={form.id} />}

      <label className="grid gap-1.5 text-sm font-medium text-[var(--foreground)]">
        Hospital / Institution Name
        <input
          required
          name="name"
          placeholder="e.g. Dhaka Medical College Hospital"
          className={inputClass}
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium text-[var(--foreground)]">
          Affiliation Status
          <select
            name="status"
            className={`${inputClass} cursor-pointer`}
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as HospitalAffiliation["status"] }))}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-sm font-medium text-[var(--foreground)]">
          Sort Order
          <input
            type="number"
            name="sort_order"
            className={inputClass}
            value={form.sort_order}
            min={0}
            onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))}
          />
        </label>
      </div>

      {/* Status preview */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 p-3">
        <p className="text-xs font-medium text-[var(--muted-foreground)] mb-2">Preview pill in header:</p>
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-[rgba(0,82,255,0.12)] border border-[rgba(0,82,255,0.35)] text-[var(--accent)]">
          <span
            className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
              form.status === "current"
                ? "bg-emerald-500"
                : form.status === "visiting"
                ? "bg-yellow-500"
                : "bg-[var(--muted-foreground)]"
            }`}
          />
          {form.name || "Hospital name"}
          <span className="opacity-60 text-[0.6rem]">
            ({form.status === "current" ? "Current" : form.status === "visiting" ? "Visiting" : "Former"})
          </span>
        </span>
      </div>

      <div>
        <button type="submit" className="btn-primary">
          {form.id ? "Save changes" : "Add hospital"}
        </button>
      </div>
    </form>
  );
}
