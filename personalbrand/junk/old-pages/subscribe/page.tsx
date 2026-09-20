import Link from "next/link";

export const metadata = { title: "Subscribed" };

export default function SubscribeSuccess() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <h1 className="text-3xl font-bold">You&apos;re subscribed!</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-300">
        Thanks for joining. You&apos;ll get the latest updates straight to your inbox.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded-full bg-neutral-900 px-6 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        Back home
      </Link>
    </div>
  );
}