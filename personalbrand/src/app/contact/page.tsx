import { ContactForm } from "@/components/sections/contact-form";

export const metadata = { title: "Contact" };

export default function Contact() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Have a question or want to book an appointment? Get in touch.
      </p>
      <ContactForm />
    </div>
  );
}
