import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import { NewsletterForm } from "@/components/newsletter-form";
import { getYouTubeThumbnail } from "@/lib/youtube";

export const dynamic = "force-dynamic";

// ─── Section label badge ──────────────────────────────────────────────────
function SectionBadge({ label, pulse = false }: { label: string; pulse?: boolean }) {
  return (
    <div className="section-badge mb-4 w-fit">
      <span className={`dot${pulse ? "" : " !animate-none opacity-60"}`} />
      <span className="label">{label}</span>
    </div>
  );
}

export default async function Home() {
  const supabase = createPublicClient();

  const [settings, portfolio, education, media, posts, hospitals] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase.from("portfolio_items").select("*").eq("is_published", true).order("created_at", { ascending: false }),
    supabase.from("education_links").select("*").order("sort_order", { ascending: true }),
    supabase.from("media").select("*").order("sort_order", { ascending: true }),
    supabase.from("posts").select("*").eq("is_published", true).order("published_at", { ascending: false }).limit(3),
    supabase.from("hospital_affiliations").select("*").order("sort_order", { ascending: true }),
  ]);

  const settingsData = settings.data;
  const heroHeadline = settingsData?.hero_headline ?? "Adult Psychiatry & Oral Medicine";
  const heroSubtitle =
    settingsData?.hero_subtitle ??
    "Psychiatrist and Oral Medicine specialist helping patients in Dhaka with assessment, treatment planning and ongoing care.";

  const rawFocus = portfolio.data?.filter((p) => p.type === "own") ?? [];
  const filteredFocus = rawFocus.filter(
    (item) =>
      !item.title.toLowerCase().includes("oral") &&
      !item.title.toLowerCase().includes("dental") &&
      !item.title.toLowerCase().includes("tooth") &&
      !item.title.toLowerCase().includes("orthopedic")
  );

  const focusItems = [
    ...filteredFocus.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      )
    })),
    {
      id: "oral-medicine-focus",
      title: "Oral Medicine & Stomatology",
      description: "Clinical diagnostics and non-surgical pharmacological care for stomatological lesions, salivary gland pathosis, temporomandibular joint (TMJ) arthralgia, and systemic manifestations.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M8 11h8" />
          <path d="M12 7v8" />
        </svg>
      )
    },
    {
      id: "tooth-odontology-focus",
      title: "Preventive Odontology & Dental Pathology",
      description: "Therapeutics for dental hard tissue preservation, periodontal health indexing, screening for micro-caries, and pathfinder evaluation for endodontic and restorative care pathways.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C9 2 6.5 4 6.5 8c0 3 2.5 5 2.5 8 .5 1.5.5 3.5 1 4.5.5 1 .5 1.5 2 1.5s1.5-.5 2-1.5c.5-1 .5-3 1-4.5 0-3 2.5-5 2.5-8 0-4-2.5-6-5.5-6z" />
        </svg>
      )
    },
    {
      id: "orthopedic-musculoskeletal-focus",
      title: "Orthopedic Medicine & Musculoskeletal Assessment",
      description: "Clinical workup for musculoskeletal pain mapping, degenerative arthropathies (osteoarthritis), sports-related tendinopathies, and physical kinesiological therapy planning.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <line x1="8.1" y1="8.1" x2="15.9" y2="15.9" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <line x1="15.9" y1="8.1" x2="8.1" y2="15.9" />
        </svg>
      )
    }
  ];

  const services = portfolio.data?.filter((p) => p.type === "client") ?? [];
  const hospitalList = hospitals.data ?? [];
  const currentHospitals = hospitalList.filter((h) => h.status === "current");
  const visitingHospitals = hospitalList.filter((h) => h.status === "visiting");
  const formerHospitals = hospitalList.filter((h) => h.status === "former");

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">

      {/* ── Profile header ──────────────────────────────────────────── */}
      <section className="border-b border-[var(--border)] py-14">
        <p className="font-mono-brand text-xs uppercase tracking-widest text-[var(--muted-foreground)]">
          Home / Profile
        </p>
        <div className="mt-8 flex flex-col items-center gap-8 md:flex-row md:items-start">
          {/* Avatar with gradient ring */}
          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-2xl gradient-accent opacity-70" />
            <div className="relative h-48 w-48 overflow-hidden rounded-2xl border-4 border-[var(--card)] bg-[var(--muted)] sm:h-56 sm:w-56">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://bdpsychiatriccare.com/img/psychiatrists/10.png"
                alt="Dr. Md. Shamsul Ahsan Maksud"
                className="h-full w-full object-cover object-[50%_0%]"
              />
            </div>
          </div>

          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h1
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
              style={{ fontFamily: "'Calistoga', Georgia, serif" }}
            >
              {heroHeadline}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)]">
              {heroSubtitle}
            </p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              MBBS, M Phil (Psychiatry), FCPS (Psychiatry)
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,82,255,0.25)] bg-[rgba(0,82,255,0.07)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
                Associate Professor, Bangladesh Medical University
              </span>
              <span className="rounded-full border-[1.5px] border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]">
                BMDC: A30070
              </span>
              <span className="rounded-full border-[1.5px] border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]">
                Sun & Tue · 2:30 – 6:00 pm
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3 md:justify-start">
          <button
            type="button"
            data-cal-link="robin-son-s7mo7q"
            data-cal-config='{"layout":"month_view","theme":"auto"}'
            className="btn-primary"
          >
            Book Appointment
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <a
            href="tel:+09604604604"
            className="inline-flex h-11 items-center gap-2 rounded-xl border-[1.5px] border-[var(--border)] px-5 text-sm font-medium text-[var(--foreground)] transition-all duration-200 hover:border-[rgba(0,82,255,0.3)] hover:text-[var(--accent)]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91A16 16 0 0 0 16 16.91l.81-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            09604604604
          </a>
        </div>
      </section>

      {/* ── In-page anchors ─────────────────────────────────────────── */}
      <nav className="flex flex-wrap gap-1 py-5 text-sm font-medium">
        {[
          ["#about", "About"],
          ["#focus", "Clinical Focus"],
          ["#services", "Services"],
          ["#hospitals", "Hospitals"],
          ["#education", "Education"],
          ["#achievements", "Achievements"],
          ["#videos", "Videos"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="rounded-lg px-3 py-1.5 text-[var(--muted-foreground)] transition-all duration-200 hover:bg-[rgba(0,82,255,0.06)] hover:text-[var(--accent)]"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* ── About ───────────────────────────────────────────────────── */}
      <section id="about" className="py-12">
        <SectionBadge label="About" />
        <h2
          className="text-3xl font-semibold"
          style={{ fontFamily: "'Calistoga', Georgia, serif" }}
        >
          Who is <span className="gradient-text">Dr. Maksud?</span>
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--muted-foreground)]">
          Dr. Md. Shamsul Ahsan Maksud is a Psychiatrist, Oral Medicine Specialist and Addiction
          Psychiatrist. He completed his MBBS from Chittagong Medical College (January 1999), MPhil
          in Psychiatry (2006) and FCPS in Psychiatry (2010) from Bangladesh Medical University. He
          trained in Oral Medicine in Oxford (Summer and Winter Schools, 2011) and under Prof.
          Kevan Wylie at Porterbrook Clinic, Sheffield, UK. He obtained FECSM in December 2012 in
          Amsterdam — the first in Bangladesh — and a Fellowship in Sexology (2014). He is President
          Elect of the South Asian Society for Oral Medicine (SASSM) since 2019, and works as an
          Associate Professor of Psychiatry and Co-ordinator of the Substance De-Addiction Clinic,
          Bangladesh Medical University.
        </p>
      </section>

      {/* ── Clinical Focus ──────────────────────────────────────────── */}
      <section id="focus" className="py-12">
        <SectionBadge label="Clinical Focus" pulse />
        <h2
          className="text-3xl font-semibold"
          style={{ fontFamily: "'Calistoga', Georgia, serif" }}
        >
          Areas of <span className="gradient-text">Expertise</span>
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">
          A multidisciplinary practice covering psychiatry, counselling and general medical care.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {focusItems.map((item) => (
            <div
              key={item.id}
              className="group card-hover rounded-2xl border-[1.5px] border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)] hover:border-[rgba(0,82,255,0.3)] hover:shadow-[var(--shadow-accent)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl gradient-accent text-white shadow-[var(--shadow-accent)] transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </span>
              <h3 className="mt-4 font-semibold text-[var(--foreground)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────────── */}
      {services.length > 0 && (
        <section id="services" className="py-12">
          <SectionBadge label="Services" />
          <h2
            className="text-3xl font-semibold"
            style={{ fontFamily: "'Calistoga', Georgia, serif" }}
          >
            What I <span className="gradient-text">Offer</span>
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {services.map((item) => (
              <li
                key={item.id}
                className="card-hover rounded-2xl border-[1.5px] border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)] hover:border-[rgba(0,82,255,0.25)]"
              >
                {/* Gradient left-border accent */}
                <div className="flex gap-4">
                  <div className="mt-1 w-1 shrink-0 self-stretch rounded-full gradient-accent opacity-70" />
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{item.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Hospital Affiliations ────────────────────────────────────── */}
      {hospitalList.length > 0 && (
        <section id="hospitals" className="py-12">
          <SectionBadge label="Hospital Affiliations" pulse={currentHospitals.length > 0} />
          <h2
            className="text-3xl font-semibold"
            style={{ fontFamily: "'Calistoga', Georgia, serif" }}
          >
            Hospital <span className="gradient-text">Affiliations</span>
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Hospitals where I currently practice, visit, or have previously worked.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {/* Current */}
            {currentHospitals.length > 0 && (
              <div className="rounded-2xl border-2 border-[rgba(0,82,255,0.2)] bg-[rgba(0,82,255,0.04)] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
                  <span className="font-mono-brand text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Currently Working</span>
                </div>
                <ul className="space-y-2">
                  {currentHospitals.map((h) => (
                    <li key={h.id} className="text-sm font-medium text-[var(--foreground)]">
                      {h.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Visiting */}
            {visitingHospitals.length > 0 && (
              <div className="rounded-2xl border-[1.5px] border-[var(--border)] bg-[var(--card)] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span className="font-mono-brand text-xs uppercase tracking-widest text-yellow-600 dark:text-yellow-400">Currently Visiting</span>
                </div>
                <ul className="space-y-2">
                  {visitingHospitals.map((h) => (
                    <li key={h.id} className="text-sm font-medium text-[var(--foreground)]">
                      {h.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Former */}
            {formerHospitals.length > 0 && (
              <div className="rounded-2xl border-[1.5px] border-[var(--border)] bg-[var(--muted)]/50 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--muted-foreground)] opacity-60" />
                  <span className="font-mono-brand text-xs uppercase tracking-widest text-[var(--muted-foreground)]">Previously Worked</span>
                </div>
                <ul className="space-y-2">
                  {formerHospitals.map((h) => (
                    <li key={h.id} className="text-sm text-[var(--muted-foreground)]">
                      {h.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Education ───────────────────────────────────────────────── */}
      <section id="education" className="py-12">
        <SectionBadge label="Education" />
        <h2
          className="text-3xl font-semibold"
          style={{ fontFamily: "'Calistoga', Georgia, serif" }}
        >
          Academic <span className="gradient-text">Background</span>
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {education.data && education.data.length > 0 ? (
            education.data.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover group rounded-2xl border-[1.5px] border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)] hover:border-[rgba(0,82,255,0.25)] hover:shadow-[var(--shadow-accent)]"
              >
                <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] opacity-0 transition-all group-hover:opacity-100">
                  View →
                </span>
              </a>
            ))
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">Education details coming soon.</p>
          )}
        </div>
      </section>

      {/* ── Achievements — inverted section ─────────────────────────── */}
      <section
        id="achievements"
        className="relative overflow-hidden rounded-3xl py-14 px-8 my-4"
        style={{ background: "var(--foreground)", color: "var(--background)" }}
      >
        {/* Dot texture */}
        <div className="pointer-events-none absolute inset-0 dot-pattern" />
        {/* Radial glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-10 blur-[80px] gradient-accent" />

        <div className="relative">
          <div className="section-badge mb-4 w-fit !bg-white/10 !border-white/20">
            <span className="dot !bg-white" />
            <span className="label !text-white">Achievements</span>
          </div>
          <h2
            className="text-3xl font-semibold"
            style={{ fontFamily: "'Calistoga', Georgia, serif", color: "var(--accent-foreground)" }}
          >
            Milestones &{" "}
            <span style={{ background: "linear-gradient(to right, #a5c0ff, #dce8ff)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              Honours
            </span>
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "First to obtain FECSM in Bangladesh (Oral Medicine, 2012).",
              "President Elect, South Asian Society for Oral Medicine (SASSM) since 2019.",
              "National trainer in Addiction Counselling, Dept. of Narcotics Control, Bangladesh (ICAP-I, 2016).",
              "Patient-centred psychiatric care with evidence-informed practice.",
            ].map((text, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ background: "linear-gradient(135deg, #0052ff, #4d7cff)", color: "white" }}>
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Videos ──────────────────────────────────────────────────── */}
      <section id="videos" className="py-12">
        <SectionBadge label="Videos" />
        <h2
          className="text-3xl font-semibold"
          style={{ fontFamily: "'Calistoga', Georgia, serif" }}
        >
          Watch & <span className="gradient-text">Learn</span>
        </h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Search, filter, and play videos inside the site.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {media.data && media.data.length > 0 ? (
            media.data.map((item) => {
              const thumb = item.thumbnail ?? getYouTubeThumbnail(item.embed_url);
              return (
                <a
                  key={item.id}
                  href={item.embed_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group card-hover overflow-hidden rounded-2xl border-[1.5px] border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)] hover:border-[rgba(0,82,255,0.25)] hover:shadow-[var(--shadow-accent)]"
                >
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt={item.title}
                      className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-[var(--muted)] p-4 text-center text-sm text-[var(--muted-foreground)]">
                      {item.title}
                    </div>
                  )}
                  <div className="flex items-center justify-between px-4 py-3">
                    <p className="font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{item.title}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)]">
                      Watch <span className="transition-transform duration-300 group-hover:translate-x-1 inline-block">→</span>
                    </span>
                  </div>
                </a>
              );
            })
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">Videos coming soon.</p>
          )}
        </div>
      </section>

      {/* ── Latest Articles ──────────────────────────────────────────── */}
      <section className="py-12">
        <div className="flex items-end justify-between">
          <div>
            <SectionBadge label="Articles" pulse />
            <h2
              className="text-3xl font-semibold"
              style={{ fontFamily: "'Calistoga', Georgia, serif" }}
            >
              Latest <span className="gradient-text">Insights</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] transition-all hover:gap-2"
          >
            View all <span>→</span>
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {posts.data && posts.data.length > 0 ? (
            posts.data.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group card-hover relative flex flex-col justify-between rounded-2xl border-[1.5px] border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)] hover:border-[rgba(0,82,255,0.3)] hover:shadow-[var(--shadow-accent)]"
              >
                {/* Hover gradient overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[rgba(0,82,255,0.03)] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative">
                  {post.featured_image && (
                    <div className="mb-4 h-36 w-full overflow-hidden rounded-xl bg-[var(--muted)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-[var(--foreground)] transition-colors duration-200 group-hover:text-[var(--accent)]">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                <div className="relative mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs text-[var(--muted-foreground)]">
                  <span>
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Recent"}
                  </span>
                  <span className="flex items-center gap-0.5 font-medium text-[var(--accent)] transition-all duration-300 group-hover:gap-1.5">
                    Read <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full py-8 text-center text-sm text-[var(--muted-foreground)]">No articles yet.</p>
          )}
        </div>
      </section>

      {/* ── Newsletter — inverted CTA ────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl my-4 py-16 px-8 text-center" style={{ background: "var(--foreground)" }}>
        <div className="pointer-events-none absolute inset-0 dot-pattern" />
        <div className="pointer-events-none absolute -bottom-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full opacity-15 blur-[80px] gradient-accent" />
        <div className="relative">
          <div className="section-badge mx-auto mb-4 w-fit !bg-white/10 !border-white/20">
            <span className="dot !bg-white" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
            <span className="label !text-white">Newsletter</span>
          </div>
          <h2
            className="text-3xl font-semibold"
            style={{ fontFamily: "'Calistoga', Georgia, serif", color: "white" }}
          >
            Stay{" "}
            <span style={{ background: "linear-gradient(to right, #a5c0ff, #dce8ff)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              Informed
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
            Get mental health insights, updates and new articles straight to your inbox.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>
      </section>

      <div className="h-12" />
    </div>
  );
}