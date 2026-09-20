"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-blue-600 py-16">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-2xl font-bold text-white">Stay Updated</h2>
        <p className="mt-2 text-blue-100">Subscribe to receive the latest articles and updates.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex max-w-md mx-auto gap-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>

        {status === "success" && (
          <p className="mt-4 text-sm text-blue-100">Thank you for subscribing!</p>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-red-200">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  );
}
