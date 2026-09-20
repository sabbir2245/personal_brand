import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/hospitals", label: "Hospitals" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 md:flex-row">
      <aside className="md:w-56 md:shrink-0">
        <div className="mb-4 flex items-center justify-between md:hidden">
          <span className="font-semibold text-[var(--foreground)]">Admin</span>
          <UserButton />
        </div>
        <nav className="flex flex-wrap gap-1 md:flex-col">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-all duration-200 hover:bg-[rgba(0,82,255,0.06)] hover:text-[var(--accent)]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="mt-2 rounded-xl px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-all duration-200 hover:bg-[rgba(0,82,255,0.06)] hover:text-[var(--accent)]"
          >
            ← View site
          </Link>
        </nav>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}