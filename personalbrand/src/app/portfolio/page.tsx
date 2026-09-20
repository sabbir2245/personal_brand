import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Clinical Focus" };

const clinicalFocus = [
  {
    title: "Cardiology",
    specialization: "Interventional Cardiology & Heart Failure Management",
    competencies: [
      "Coronary angioplasty",
      "Echocardiography",
      "Lipid disorder management",
      "Hypertension control",
      "Post-myocardial infarction rehabilitation",
    ],
    population: "Adults with ischemic heart disease, heart failure, complex arrhythmias, or cardiovascular risk factors.",
    procedures: [
      "12-lead ECG interpretation",
      "Transesophageal echocardiography (TEE)",
      "Stress testing",
      "Diagnostic cardiac catheterization",
    ],
  },
  {
    title: "Family Medicine",
    specialization: "Comprehensive Primary Care & Preventative Health",
    competencies: [
      "Chronic disease management (diabetes, hypertension, asthma)",
      "Routine health screenings",
      "Adult and pediatric immunizations",
      "Acute illness care",
    ],
    population: "Individuals and families of all age groups, from pediatrics through geriatrics.",
    procedures: [
      "Annual wellness exams",
      "Routine lab work evaluation",
      "Minor skin procedures",
      "Basic point-of-care testing",
    ],
  },
  {
    title: "Orthopedic Surgery",
    specialization: "Sports Medicine & Joint Reconstruction",
    competencies: [
      "Arthroscopic knee/shoulder surgery",
      "Total hip and knee arthroplasty",
      "Fracture management",
      "Ligament repair (ACL/MCL)",
    ],
    population: "Athletes, active individuals, and older adults with degenerative joint diseases or traumatic musculoskeletal injuries.",
    procedures: [
      "Diagnostic MRI review",
      "Joint injections (corticosteroid/PRP)",
      "Minimally invasive joint repair",
      "Surgical joint replacement",
    ],
  },
];

export default function Portfolio() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clinical Focus</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Specialized medical expertise across multiple disciplines.
      </p>

      <div className="mt-10 grid gap-6">
        {clinicalFocus.map((area) => (
          <Card key={area.title}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{area.title}</h2>
            <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
              {area.specialization}
            </p>

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Core Competencies</h3>
              <ul className="mt-2 space-y-1">
                {area.competencies.map((c) => (
                  <li key={c} className="text-sm text-gray-600 dark:text-gray-400">• {c}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Target Patient Population</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{area.population}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Procedures & Diagnostics</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {area.procedures.map((p) => (
                  <Badge key={p} variant="info">{p}</Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
