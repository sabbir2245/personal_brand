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
  { value: "current", label: "Currently Working" },
  { value: "visiting", label: "Currently Visiting" },
  { value: "former", label: "Previously Worked" },
];

const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";

export function HospitalAffiliationForm({ hospital }: { hospital: HospitalAffiliation }) {
  const [form, setForm] = useState(hospital);

  return (
    <form action={saveHospitalAffiliation} className="mt-4 grid gap-4">
      {form.id && <input type="hidden" name="id" value={form.id} />}

      <label className="grid gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
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
        <label className="grid gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
          Affiliation Status
          <select
            name="status"
            className={inputClass}
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as HospitalAffiliation["status"] }))}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
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

      <div>
        <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
          {form.id ? "Save changes" : "Add hospital"}
        </button>
      </div>
    </form>
  );
}
