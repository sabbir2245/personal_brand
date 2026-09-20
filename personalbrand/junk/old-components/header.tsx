import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ThemeToggle } from "./theme-toggle";
import { createPublicClient } from "@/lib/supabase/public";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Clinical Focus" },
  { href: "/#hospitals", label: "Hospitals" },
  { href: "/blog", label: "Articles" },
  { href: "/education", label: "Education" },
  { href: "/media", label: "Videos" },
  { href: "/contact", label: "Contact" },
];

const STATUS_STYLE: Record<string, { label: string; classes: string; dot: string }> = {
  current: {
    label: "Current",
    classes: "bg-[rgba(0,82,255,0.12)] border border-[rgba(0,82,255,0.35)] text-[var(--accent)]",
    dot: "bg-[var(--accent)]",
  },
  visiting: {
    label: "Visiting",
    classes: "bg-[rgba(0,82,255,0.06)] border border-[rgba(0,82,255,0.2)] text-[var(--accent-secondary)]",
    dot: "bg-[var(--accent-secondary)]",
  },
  former: {
    label: "Former",
    classes: "bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)]",
    dot: "bg-[var(--muted-foreground)]",
  },
};

export async function Header() {
  const { userId } = await auth();
  const signedIn = Boolean(userId);

  // Fetch hospital affiliations
  const supabase = createPublicClient();
  const { data: hospitals } = await supabase
    .from("hospital_affiliations")
    .select("id, name, status")
    .order("sort_order", { ascending: true });

  return (
    <>
      {/* ── Top info bar ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0052ff, #4d7cff)" }}>
        {/* Subtle dot texture */}
        <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-1 px-4 py-2.5 text-xs text-white/90 sm:px-6">
          {/* Address + contact row */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 sm:justify-between">
            <span className="text-center sm:text-left">
              Shimanto Shambhar Shopping Complex (6th Floor), Dhanmondi, Dhaka-1205
            </span>
            <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <a href="mailto:contact@bdpsychiatriccare.com" className="hover:text-white transition-colors">
                contact@bdpsychiatriccare.com
              </a>
              <a href="tel:+09677604604" className="hover:text-white transition-colors whitespace-nowrap">
                09677604604 | 01872863002
              </a>
            </span>
          </div>

          {/* Hospital affiliation pills */}
          {hospitals && hospitals.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="font-mono-brand text-[0.6rem] uppercase tracking-widest text-white/60">
                Hospitals:
              </span>
              {hospitals.map((h) => {
                const style = STATUS_STYLE[h.status] ?? STATUS_STYLE.former;
                return (
                  <span
                    key={h.id}
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.65rem] font-medium bg-white/15 border border-white/25 text-white backdrop-blur-sm"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                        h.status === "current"
                          ? "bg-emerald-300"
                          : h.status === "visiting"
                          ? "bg-yellow-300"
                          : "bg-white/50"
                      }`}
                      style={h.status === "current" ? { animation: "pulse-dot 2s ease-in-out infinite" } : undefined}
                    />
                    {h.name}
                    <span className="text-white/50 text-[0.55rem]">
                      ({h.status === "current" ? "Current" : h.status === "visiting" ? "Visiting" : "Former"})
                    </span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Main header ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)]/85 backdrop-blur-md dark:border-[var(--border)] dark:bg-[var(--background)]/90 shadow-[var(--shadow-sm)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          {/* Doctor name / logo */}
          <Link
            href="/"
            className="shrink-0 whitespace-nowrap text-sm font-semibold tracking-tight sm:text-base lg:text-lg transition-opacity hover:opacity-80"
            style={{ fontFamily: "'Calistoga', Georgia, serif" }}
          >
            Dr. Md. Shamsul{" "}
            <span className="gradient-text">Ahsan Maksud</span>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-auto hidden items-center gap-1 text-sm font-medium lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative rounded-lg px-3 py-2 text-[var(--muted-foreground)] transition-all duration-200 hover:bg-[rgba(0,82,255,0.06)] hover:text-[var(--accent)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-2.5 lg:ml-3">
            <ThemeToggle />
            <button
              type="button"
              data-cal-link="robin-son-s7mo7q"
              data-cal-config='{"layout":"month_view","theme":"auto"}'
              className="hidden sm:inline-flex btn-primary text-sm"
            >
              Book Appointment
            </button>
            <Link
              href="/admin"
              className="hidden rounded-xl border border-[var(--border)] px-3.5 py-1.5 text-sm font-medium text-[var(--muted-foreground)] transition-all duration-200 hover:border-[rgba(0,82,255,0.3)] hover:text-[var(--accent)] xl:inline-flex"
            >
              Admin
            </Link>
            {!signedIn ? (
              <SignInButton mode="modal">
                <button className="rounded-xl bg-[var(--foreground)] px-3.5 py-1.5 text-sm font-medium text-[var(--accent-foreground)] transition-all duration-200 hover:opacity-80 dark:bg-[var(--muted)]">
                  Sign in
                </button>
              </SignInButton>
            ) : (
              <UserButton
                appearance={{
                  elements: { avatarBox: "h-8 w-8" },
                }}
              />
            )}
          </div>
        </div>
      </header>
    </>
  );
}