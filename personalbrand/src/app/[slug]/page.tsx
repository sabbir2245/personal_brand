import { notFound } from "next/navigation";
import { getDoctorBySlug, getDoctorSettings } from "@/lib/doctor";
import { createServerClient } from "@/lib/supabase/server";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Newsletter } from "@/components/sections/newsletter";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DoctorPage({ params }: PageProps) {
  const { slug } = await params;

  // Look up doctor by slug
  const doctor = await getDoctorBySlug(slug);
  if (!doctor || !doctor.is_onboarded) {
    notFound();
  }

  // Get doctor's settings
  const settings = await getDoctorSettings(doctor.id);

  // Get doctor's published portfolio items
  const supabase = createServerClient();
  const { data: portfolioItems } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("doctor_id", doctor.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <Hero settings={settings} />
      <About settings={settings} />
      <Services settings={settings} />
      {portfolioItems && portfolioItems.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Clinical Focus</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {portfolioItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  {item.description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  )}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Learn more →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <Newsletter />
    </>
  );
}
