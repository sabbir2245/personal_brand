"use client";

import { useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      } else {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setMessage("Thanks! Your message has been sent.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
      <input
        type="text"
        required
        value={form.name}
        onChange={update("name")}
        placeholder="Your name"
        className="h-11 rounded-lg border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900"
      />
      <input
        type="email"
        required
        value={form.email}
        onChange={update("email")}
        placeholder="you@example.com"
        className="h-11 rounded-lg border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900"
      />
      <textarea
        required
        value={form.message}
        onChange={update("message")}
        placeholder="Your message"
        rows={6}
        className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-11 rounded-full bg-neutral-900 px-6 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
      {status === "error" && <p className="text-sm text-red-600 dark:text-red-400">{message}</p>}
      {status === "success" && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
    </form>
  );
}