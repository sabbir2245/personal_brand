"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Doctor = {
  id: string;
  slug: string;
  display_name: string;
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";

export function OnboardingForm({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    slug: doctor.slug,
    display_name: doctor.display_name,
    site_name: "",
    doctor_name: "",
    doctor_title: "",
    doctor_qualifications: "",
    doctor_photo_url: "",
    doctor_about: "",
    doctor_bmdc_id: "",
    doctor_location: "",
    contact_email: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
          Your display name
          <input
            name="display_name"
            className={inputClass}
            value={form.display_name}
            onChange={set("display_name")}
            placeholder="Dr. John Smith"
            required
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
          Website slug (subdomain)
          <input
            name="slug"
            className={inputClass}
            value={form.slug}
            onChange={set("slug")}
            placeholder="dr-john-smith"
            required
            pattern="[a-z0-9\-]+"
          />
          <span className="text-xs text-gray-500">Your site: {form.slug || "your-slug"}.yourdomain.com</span>
        </label>
      </div>

      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Site name
        <input
          name="site_name"
          className={inputClass}
          value={form.site_name}
          onChange={set("site_name")}
          placeholder="Dr. John Smith - Psychiatry"
        />
      </label>

      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Full name (as doctor)
        <input
          name="doctor_name"
          className={inputClass}
          value={form.doctor_name}
          onChange={set("doctor_name")}
          placeholder="Dr. John Smith"
        />
      </label>

      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Title / Position
        <input
          name="doctor_title"
          className={inputClass}
          value={form.doctor_title}
          onChange={set("doctor_title")}
          placeholder="Associate Professor, Harvard Medical School"
        />
      </label>

      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Qualifications
        <input
          name="doctor_qualifications"
          className={inputClass}
          value={form.doctor_qualifications}
          onChange={set("doctor_qualifications")}
          placeholder="MD, Board Certified Psychiatrist"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
          BMDC ID (if applicable)
          <input
            name="doctor_bmdc_id"
            className={inputClass}
            value={form.doctor_bmdc_id}
            onChange={set("doctor_bmdc_id")}
            placeholder="A30070"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
          Location
          <input
            name="doctor_location"
            className={inputClass}
            value={form.doctor_location}
            onChange={set("doctor_location")}
            placeholder="Dhaka, Bangladesh"
          />
        </label>
      </div>

      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Photo URL
        <input
          name="doctor_photo_url"
          className={inputClass}
          value={form.doctor_photo_url}
          onChange={set("doctor_photo_url")}
          placeholder="https://example.com/photo.jpg"
        />
      </label>

      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        About text
        <textarea
          name="doctor_about"
          className={inputClass}
          rows={4}
          value={form.doctor_about}
          onChange={set("doctor_about")}
          placeholder="Tell patients about yourself, your experience, and your approach to care..."
        />
      </label>

      <label className="grid gap-1 text-sm font-medium text-gray-900 dark:text-white">
        Contact email
        <input
          name="contact_email"
          type="email"
          className={inputClass}
          value={form.contact_email}
          onChange={set("contact_email")}
          placeholder="you@example.com"
        />
      </label>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Create My Portfolio"}
        </button>
      </div>
    </form>
  );
}
