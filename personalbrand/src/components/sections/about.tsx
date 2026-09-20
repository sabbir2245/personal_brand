type Settings = {
  doctor_about?: string;
} | null;

export function About({ settings }: { settings: Settings }) {
  const aboutText = settings?.doctor_about || "Dedicated psychiatrist and oral medicine specialist with over a decade of experience in adult psychiatry, addiction medicine, and oral health. Committed to providing comprehensive mental health care and advancing medical education in Bangladesh.";

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About</h2>
        <p className="mt-4 max-w-3xl text-gray-600 dark:text-gray-400">
          {aboutText}
        </p>
      </div>
    </section>
  );
}
