"use client";

import { useState } from "react";
import { saveEducation } from "@/app/admin/actions";

type Item = { id?: string; title: string; description: string; url: string; sort_order: number };

const inputClass =
  "rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100";

export function EducationForm({ item }: { item: Item }) {
  const [form, setForm] = useState(item);
  const set = (k: keyof Item) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form action={saveEducation} className="mt-6 grid gap-4">
      {item.id && <input type="hidden" name="id" value={item.id} />}
      <label className="grid gap-1 text-sm font-medium">
        Title
        <input required name="title" className={inputClass} value={form.title} onChange={set("title")} />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Description
        <textarea name="description" className={inputClass} rows={2} value={form.description} onChange={set("description")} />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        URL
        <input name="url" className={inputClass} value={form.url} onChange={set("url")} />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Sort order
        <input
          name="sort_order"
          type="number"
          className={inputClass}
          value={form.sort_order}
          onChange={set("sort_order")}
        />
      </label>
      <div>
        <button className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
          Save
        </button>
      </div>
    </form>
  );
}