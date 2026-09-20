"use client";

import { useState } from "react";
import { savePortfolio } from "@/app/admin/actions";

type Item = {
  id?: string;
  type: string;
  title: string;
  description: string;
  url: string;
  image: string;
  tech_stack: string;
  is_published?: boolean;
};

const inputClass =
  "rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100";

export function PortfolioForm({ item }: { item: Item }) {
  const [form, setForm] = useState(item);
  const set = (k: keyof Item) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form action={savePortfolio} className="mt-6 grid gap-4">
      {item.id && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Type
          <select name="type" className={inputClass} value={form.type} onChange={set("type")}>
            <option value="own">Owned</option>
            <option value="client">Client</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Title
          <input required name="title" className={inputClass} value={form.title} onChange={set("title")} />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-medium">
        Description
        <textarea name="description" className={inputClass} rows={3} value={form.description} onChange={set("description")} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          URL
          <input name="url" className={inputClass} value={form.url} onChange={set("url")} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Image URL
          <input name="image" className={inputClass} value={form.image} onChange={set("image")} />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-medium">
        Tech stack (comma-separated)
        <input name="tech_stack" className={inputClass} value={form.tech_stack} onChange={set("tech_stack")} />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input name="is_published" type="checkbox" defaultChecked={form.is_published} className="h-4 w-4" />
        Published
      </label>
      <div>
        <button className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
          Save
        </button>
      </div>
    </form>
  );
}