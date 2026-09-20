import { Card } from "@/components/ui/card";

type Service = {
  title: string;
  description: string;
};

type Settings = {
  doctor_services?: Service[];
} | null;

const defaultServices: Service[] = [
  {
    title: "Adult Psychiatry",
    description: "Comprehensive evaluation and treatment of mental health disorders in adults.",
  },
  {
    title: "Addiction Medicine",
    description: "Specialized care for substance use disorders and behavioral addictions.",
  },
  {
    title: "Oral Medicine",
    description: "Diagnosis and treatment of oral diseases and conditions.",
  },
  {
    title: "Clinical Consultation",
    description: "Expert consultation for complex psychiatric and oral health cases.",
  },
];

export function Services({ settings }: { settings: Settings }) {
  const services = settings?.doctor_services?.length ? settings.doctor_services : defaultServices;

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.title} hover>
              <h3 className="font-semibold text-gray-900 dark:text-white">{service.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
