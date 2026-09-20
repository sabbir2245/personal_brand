import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Education" };

const education = [
  {
    degree: "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
    institution: "Dhaka Medical College (DMC) / University of Dhaka",
    duration: "5-Year Professional Degree + 1-Year Compulsory Rotational Internship (DMCH)",
  },
  {
    degree: "Fellow of the College of Physicians and Surgeons (FCPS)",
    field: "Internal Medicine / Surgery",
    institution: "Bangladesh College of Physicians and Surgeons (BCPS), Dhaka",
  },
  {
    degree: "Doctor of Medicine (MD) / Master of Surgery (MS)",
    institution: "Bangabandhu Sheikh Mujib Medical University (BSMMU), Shahbag, Dhaka",
  },
];

const positions = [
  {
    role: "Assistant Professor / Lecturer",
    department: "Department of General Medicine / Surgery",
    institution: "Dhaka Medical College & Hospital (DMCH)",
    responsibilities: "Delivering clinical lectures to 4th and 5th-year MBBS students, conducting bedside teaching, and supervising post-graduate FCPS/MD residents.",
  },
  {
    role: "Consultant & Specialist",
    hospital: "Dhaka Medical College Hospital",
    duties: "Indoor & Outdoor Patient Care",
  },
];

const accreditation = [
  {
    title: "BCS (Health Cadre)",
    description: "Qualified through the Bangladesh Civil Service (BCS) competitive exam under the Ministry of Health and Family Welfare.",
  },
  {
    title: "BMDC Registration",
    description: "Fully registered medical practitioner with the Bangladesh Medical and Dental Council (BMDC Reg No: A-XXXXX).",
  },
];

export default function Education() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Education & Qualifications</h1>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Academic Background</h2>
        <div className="mt-4 grid gap-4">
          {education.map((item) => (
            <Card key={item.degree}>
              <h3 className="font-semibold text-gray-900 dark:text-white">{item.degree}</h3>
              {item.field && (
                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">{item.field}</p>
              )}
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.institution}</p>
              {item.duration && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{item.duration}</p>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Current Positions</h2>
        <div className="mt-4 grid gap-4">
          {positions.map((pos) => (
            <Card key={pos.role}>
              <h3 className="font-semibold text-gray-900 dark:text-white">{pos.role}</h3>
              <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                {pos.department || pos.hospital}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {pos.institution || pos.duties}
              </p>
              {pos.responsibilities && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">{pos.responsibilities}</p>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Government Accreditation</h2>
        <div className="mt-4 grid gap-4">
          {accreditation.map((item) => (
            <Card key={item.title}>
              <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
