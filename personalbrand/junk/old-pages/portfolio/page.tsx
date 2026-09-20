import { createPublicClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

export const metadata = { title: "Clinical Focus" };

export default async function Portfolio() {
  const supabase = createPublicClient();
  const { data: items } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const ownedRaw = items?.filter((i) => i.type === "own") ?? [];
  const client = items?.filter((i) => i.type === "client") ?? [];

  const filteredOwned = ownedRaw.filter(
    (item) =>
      !item.title.toLowerCase().includes("oral") &&
      !item.title.toLowerCase().includes("dental") &&
      !item.title.toLowerCase().includes("tooth") &&
      !item.title.toLowerCase().includes("orthopedic"),
  );

  const owned = [
    ...filteredOwned,
    {
      id: "oral-medicine-focus",
      title: "Oral Medicine & Stomatology",
      description: "Clinical diagnostics and non-surgical pharmacological care for stomatological lesions, salivary gland pathosis, temporomandibular joint (TMJ) arthralgia, and systemic manifestations.",
      tech_stack: ["Oral Medicine", "Stomatology"],
      url: null,
    },
    {
      id: "tooth-odontology-focus",
      title: "Preventive Odontology & Dental Pathology",
      description: "Therapeutics for dental hard tissue preservation, periodontal health indexing, screening for micro-caries, and pathfinder evaluation for endodontic and restorative care pathways.",
      tech_stack: ["Odontology", "Dental"],
      url: null,
    },
    {
      id: "orthopedic-musculoskeletal-focus",
      title: "Orthopedic Medicine & Musculoskeletal Assessment",
      description: "Clinical workup for musculoskeletal pain mapping, degenerative arthropathies (osteoarthritis), sports-related tendinopathies, and physical kinesiological therapy planning.",
      tech_stack: ["Orthopedics", "Musculoskeletal"],
      url: null,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">Clinical Focus &amp; Services</h1>
      <Section title="Clinical Focus" items={owned} />
      <Section title="Services" items={client} />
    </div>
  );
}

function Section({
  title,
  items,
}: {
  title: string;
  items: { id: string; title: string; description: string | null; url: string | null; tech_stack: string[] | null }[];
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800 transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-md"
            >
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{item.title}</h3>
              {item.description && (
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
              )}
              {item.tech_stack && item.tech_stack.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tech_stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Nothing here yet.</p>
        )}
      </div>
    </section>
  );
}