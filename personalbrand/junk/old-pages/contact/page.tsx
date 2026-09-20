import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-300">
        Have a question or want to book an appointment? Get in touch.
      </p>
      <ContactForm />
    </div>
  );
}