import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./theme-toggle";
import { getCurrentDoctor } from "@/lib/doctor";

export async function Header() {
  const { userId } = await auth();
  const doctor = userId ? await getCurrentDoctor() : null;

  const navLinks = [
    { href: "/", label: "Home" },
    ...(doctor?.is_onboarded
      ? [
          { href: `/${doctor.slug}`, label: "My Site" },
          { href: "/blog", label: "Articles" },
          { href: "/education", label: "Education" },
          { href: "/media", label: "Videos" },
          { href: "/contact", label: "Contact" },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-semibold text-gray-900 dark:text-white">
          {doctor?.display_name || "Doctor Portfolio"}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {userId ? (
            <>
              <Link
                href="/admin"
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Admin
              </Link>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
