"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      } else {
        setStatus("success");
        setEmail("");
        setMessage("You're subscribed!");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        disabled={status === "loading"}
        className="h-11 flex-1 rounded-full border border-neutral-300 bg-white px-5 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-11 rounded-full bg-neutral-900 px-6 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      {status === "error" && <p className="text-sm text-red-600 dark:text-red-400">{message}</p>}
      {status === "success" && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
    </form>
  );
}