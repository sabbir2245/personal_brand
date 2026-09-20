"use client";

import { useState } from "react";
import { saveEducation } from "@/app/admin/actions";

type Item = { id?: string; title: string; description: string; url: string; sort_order: number };

const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";

export function EducationForm({ item }: { item: Item }) {
  const [form, setForm] = useState(item);
  const set = (k: keyof Item) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form action={saveEducation} className="mt-6 grid gap-4">
      {item.id && <input type="hidden" name="id" value={item.id} />}
      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Title
        <input required name="title" className={inputClass} value={form.title} onChange={set("title")} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Description
        <textarea name="description" className={inputClass} rows={2} value={form.description} onChange={set("description")} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        URL
        <input name="url" className={inputClass} value={form.url} onChange={set("url")} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Sort order
        <input name="sort_order" type="number" className={inputClass} value={form.sort_order} onChange={set("sort_order")} />
      </label>
      <div>
        <button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Save
        </button>
      </div>
    </form>
  );
}
