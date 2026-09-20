import Link from "next/link";

type Settings = {
  doctor_name?: string;
  doctor_title?: string;
  doctor_qualifications?: string;
  doctor_photo_url?: string;
  doctor_bmdc_id?: string;
  doctor_location?: string;
} | null;

export function Hero({ settings }: { settings: Settings }) {
  const doctorName = settings?.doctor_name || "Dr. Md. Shamsul Ahsan Maksud";
  const doctorTitle = settings?.doctor_title || "Associate Professor, Bangladesh Medical University";
  const doctorQualifications = settings?.doctor_qualifications || "MBBS, M Phil (Psychiatry), FCPS (Psychiatry)";
  const doctorPhoto = settings?.doctor_photo_url || "https://bdpsychiatriccare.com/img/psychiatrists/10.png";
  const doctorBmdc = settings?.doctor_bmdc_id || "A30070";
  const doctorLocation = settings?.doctor_location || "Dhaka, Bangladesh";

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={doctorPhoto}
            alt={doctorName}
            className="mb-6 h-48 w-48 rounded-2xl object-cover object-top"
          />

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {doctorName}
          </h1>

          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {doctorQualifications}
          </p>

          <p className="mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            {doctorTitle} | BMDC: {doctorBmdc} | {doctorLocation}
          </p>

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              data-cal-link="robin-son-s7mo7q"
              data-cal-config='{"layout":"month_view","theme":"auto"}'
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Book Appointment
            </button>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
