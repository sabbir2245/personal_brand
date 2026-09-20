"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMsg(data.error || "Something went wrong");
      } else {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setMsg("Thanks! Your message has been sent.");
      }
    } catch {
      setStatus("error");
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
      <Input
        type="text"
        required
        placeholder="Your name"
        value={form.name}
        onChange={update("name")}
      />
      <Input
        type="email"
        required
        placeholder="you@example.com"
        value={form.email}
        onChange={update("email")}
      />
      <textarea
        required
        value={form.message}
        onChange={update("message")}
        placeholder="Your message"
        rows={6}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
      />
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send message"}
      </Button>
      {status === "error" && <p className="text-sm text-red-500">{msg}</p>}
      {status === "success" && <p className="text-sm text-green-600">{msg}</p>}
    </form>
  );
}
