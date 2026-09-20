import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Platform</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">For Doctors</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Create your portfolio</li>
              <li>Showcase your expertise</li>
              <li>Connect with patients</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Support</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>help@doctorportfolio.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Doctor Portfolio Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
