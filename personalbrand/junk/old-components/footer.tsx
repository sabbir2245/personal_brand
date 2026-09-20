import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Important Links
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/" className="text-neutral-600 hover:underline dark:text-neutral-300">About</Link></li>
            <li><Link href="/contact" className="text-neutral-600 hover:underline dark:text-neutral-300">Contact Us</Link></li>
            <li><Link href="/blog" className="text-neutral-600 hover:underline dark:text-neutral-300">Articles</Link></li>
            <li><Link href="/portfolio" className="text-neutral-600 hover:underline dark:text-neutral-300">Clinical Focus</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Get In Touch
          </h3>
          <address className="mt-4 space-y-2 text-sm not-italic text-neutral-600 dark:text-neutral-300">
            <p>Shimanto Shambhar Shopping Complex (6th Floor), Dhanmondi Road# 2, Dhaka-1205</p>
            <p><a href="mailto:contact@bdpsychiatriccare.com" className="hover:underline">contact@bdpsychiatriccare.com</a></p>
            <p><a href="tel:+09677604604" className="hover:underline">09677604604</a>, <a href="tel:+01872863002" className="hover:underline">01872863002</a></p>
          </address>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Chamber Hours
          </h3>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
            Sunday &amp; Tuesday, 2:30 pm to 6:00 pm
          </p>
          <a
            href="http://103.219.160.253:2223/apex/r/bpcl_his/ati-csms165/online-dr-appointment?P80_DOCTOR_NO=DR250030073"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-full bg-teal-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-teal-600"
          >
            Book Appointment
          </a>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        © {new Date().getFullYear()} Bangladesh Psychiatric Care Ltd. All rights reserved.
      </div>
    </footer>
  );
}