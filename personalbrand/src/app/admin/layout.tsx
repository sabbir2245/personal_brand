import Link from "next/link";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { getCurrentDoctor } from "@/lib/doctor";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/hospitals", label: "Hospitals" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const doctor = await getCurrentDoctor();

  // Not logged in — Clerk middleware already handles this,
  // but just in case:
  if (!doctor) {
    redirect("/onboarding");
  }

  // Logged in but hasn't completed onboarding
  if (!doctor.is_onboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 md:flex-row">
      <aside className="md:w-56 md:shrink-0">
        <div className="mb-4 flex items-center justify-between md:hidden">
          <span className="font-semibold text-gray-900 dark:text-white">Admin</span>
          <UserButton />
        </div>
        <nav className="flex flex-wrap gap-1 md:flex-col">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={`/${doctor.slug}`}
            className="mt-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            ← View my site
          </Link>
        </nav>
        <div className="hidden md:block mt-4">
          <UserButton />
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
