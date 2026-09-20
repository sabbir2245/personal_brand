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
  doctor_name: string;
  doctor_title: string;
  doctor_qualifications: string;
  doctor_photo_url: string;
  doctor_about: string;
  doctor_services: string;
  doctor_bmdc_id: string;
  doctor_location: string;
};

const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [form, setForm] = useState(settings);
  const set = (k: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form action={saveSettings} className="mt-6 grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
          Site name
          <input name="site_name" className={inputClass} value={form.site_name} onChange={set("site_name")} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
          Contact email
          <input name="contact_email" className={inputClass} value={form.contact_email} onChange={set("contact_email")} />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Tagline
        <input name="tagline" className={inputClass} value={form.tagline} onChange={set("tagline")} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Hero headline
        <input name="hero_headline" className={inputClass} value={form.hero_headline} onChange={set("hero_headline")} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Hero subtitle
        <textarea name="hero_subtitle" className={inputClass} rows={2} value={form.hero_subtitle} onChange={set("hero_subtitle")} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Social links (JSON)
        <textarea name="social_links" className={`${inputClass} font-mono`} rows={4} value={form.social_links} onChange={set("social_links")} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Theme colors (JSON)
        <textarea name="theme_colors" className={`${inputClass} font-mono`} rows={3} value={form.theme_colors} onChange={set("theme_colors")} />
      </label>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Doctor Profile</h3>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
          Doctor name
          <input name="doctor_name" className={inputClass} value={form.doctor_name} onChange={set("doctor_name")} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
          BMDC ID
          <input name="doctor_bmdc_id" className={inputClass} value={form.doctor_bmdc_id} onChange={set("doctor_bmdc_id")} />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Doctor title / position
        <input name="doctor_title" className={inputClass} value={form.doctor_title} onChange={set("doctor_title")} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Qualifications
        <input name="doctor_qualifications" className={inputClass} value={form.doctor_qualifications} onChange={set("doctor_qualifications")} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Location
        <input name="doctor_location" className={inputClass} value={form.doctor_location} onChange={set("doctor_location")} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Photo URL
        <input name="doctor_photo_url" className={inputClass} value={form.doctor_photo_url} onChange={set("doctor_photo_url")} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        About text
        <textarea name="doctor_about" className={inputClass} rows={4} value={form.doctor_about} onChange={set("doctor_about")} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Services (JSON array)
        <textarea name="doctor_services" className={`${inputClass} font-mono`} rows={6} value={form.doctor_services} onChange={set("doctor_services")} />
      </label>
      
      <div>
        <button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Save settings
        </button>
      </div>
    </form>
  );
}
