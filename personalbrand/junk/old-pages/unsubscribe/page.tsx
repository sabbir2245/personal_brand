"use client";

import { useState } from "react";

export default function UnsubscribePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(`/api/unsubscribe?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      } else {
        setStatus("success");
        setMessage("You've been unsubscribed. Sorry to see you go!");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <h1 className="text-3xl font-bold">Unsubscribe</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-300">
        Enter your email to stop receiving updates.
      </p>
      <form onSubmit={handleSubmit} className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-11 flex-1 rounded-full border border-neutral-300 bg-white px-5 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-11 rounded-full bg-neutral-900 px-6 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {status === "loading" ? "Working…" : "Unsubscribe"}
        </button>
      </form>
      {status === "error" && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{message}</p>}
      {status === "success" && <p className="mt-4 text-sm text-green-600 dark:text-green-400">{message}</p>}
    </div>
  );
}