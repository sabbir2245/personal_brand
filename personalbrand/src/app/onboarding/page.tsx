import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-up");
  }

  const supabase = createServerClient();

  // Find or create doctor profile
  let { data: doctor } = await supabase
    .from("doctors")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!doctor) {
    // Auto-create doctor profile for this user
    const { data: newDoctor, error } = await supabase
      .from("doctors")
      .insert({
        clerk_user_id: userId,
        slug: `dr-${userId.slice(0, 8).toLowerCase()}`,
        display_name: "",
        email: null,
        is_onboarded: false,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Failed to create doctor profile:", error);
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-600">Error creating profile. Please try again.</p>
        </div>
      );
    }
    doctor = newDoctor;
  }

  // If already onboarded, go to admin
  if (doctor.is_onboarded) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome! Set Up Your Portfolio
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Complete your profile to create your personal doctor portfolio website.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <OnboardingForm doctor={doctor} />
        </div>
      </div>
    </div>
  );
}
