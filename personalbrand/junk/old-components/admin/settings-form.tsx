"use client";

import { useState } from "react";
import { saveSettings } from "@/app/admin/actions";

type Settings = {
  site_name: string;
  tagline: string;
  hero_headline: string;
  hero_subtitle: string;
  contact_email: string;
  social_links: string;
  theme_colors: string;
};

const inputClass =
  "rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [form, setForm] = useState(settings);
  const set = (k: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form action={saveSettings} className="mt-6 grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Site name
          <input name="site_name" className={inputClass} value={form.site_name} onChange={set("site_name")} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Contact email
          <input name="contact_email" className={inputClass} value={form.contact_email} onChange={set("contact_email")} />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-medium">
        Tagline
        <input name="tagline" className={inputClass} value={form.tagline} onChange={set("tagline")} />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Hero headline
        <input name="hero_headline" className={inputClass} value={form.hero_headline} onChange={set("hero_headline")} />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Hero subtitle
        <textarea name="hero_subtitle" className={inputClass} rows={2} value={form.hero_subtitle} onChange={set("hero_subtitle")} />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Social links (JSON)
        <textarea name="social_links" className={`${inputClass} font-mono`} rows={4} value={form.social_links} onChange={set("social_links")} />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Theme colors (JSON)
        <textarea name="theme_colors" className={`${inputClass} font-mono`} rows={3} value={form.theme_colors} onChange={set("theme_colors")} />
      </label>
      <div>
        <button className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
          Save settings
        </button>
      </div>
    </form>
  );
}