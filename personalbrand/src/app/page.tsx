import Link from "next/link";

export default function Home() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Doctor Portfolio Platform
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
          Create your professional medical portfolio website in minutes.
          Showcase your expertise, education, and services to patients.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sign-up"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Get Started Free
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-300 px-8 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Your Profile</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Add your qualifications, experience, and services. Customize your portfolio to match your practice.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Your Own Website</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Get a unique subdomain for your practice. Share your portfolio with patients worldwide.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Easy Management</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Update your portfolio anytime from the admin dashboard. No coding required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
