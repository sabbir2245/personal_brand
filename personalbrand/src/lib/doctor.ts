import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "./supabase/server";

export type Doctor = {
  id: string;
  clerk_user_id: string;
  slug: string;
  display_name: string;
  email: string | null;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Get the current authenticated user's doctor profile.
 * Returns null if not authenticated or no doctor profile exists.
 */
export async function getCurrentDoctor(): Promise<Doctor | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createServerClient();
  const { data } = await supabase
    .from("doctors")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  return data as Doctor | null;
}

/**
 * Get a doctor profile by slug (for public subdomain routing).
 */
export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("doctors")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return data as Doctor | null;
}

/**
 * Get site settings for a specific doctor.
 */
export async function getDoctorSettings(doctorId: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("doctor_id", doctorId)
    .maybeSingle();

  return data;
}

/**
 * Ensure the current user has a doctor profile. Creates one if not.
 * Returns the doctor profile.
 */
export async function ensureDoctorProfile(): Promise<Doctor> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const supabase = createServerClient();

  // Check if doctor already exists
  const { data: existing } = await supabase
    .from("doctors")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (existing) return existing as Doctor;

  // Create new doctor profile
  const { data: newDoctor, error } = await supabase
    .from("doctors")
    .insert({
      clerk_user_id: userId,
      slug: `dr-${userId.slice(0, 8)}`,
      display_name: "",
      email: null,
      is_onboarded: false,
    })
    .select("*")
    .single();

  if (error) throw new Error(`Failed to create doctor profile: ${error.message}`);
  return newDoctor as Doctor;
}

/**
 * Extract doctor slug from hostname for subdomain routing.
 * e.g., "dr-robinson.localhost:3000" -> "dr-robinson"
 * e.g., "dr-robinson.myapp.com" -> "dr-robinson"
 */
export function extractDoctorSlug(hostname: string): string | null {
  // Remove port if present
  const host = hostname.split(":")[0];

  // In development: hostname might be "dr-slug.localhost"
  // In production: hostname might be "dr-slug.yourdomain.com"
  const parts = host.split(".");

  if (parts.length < 2) return null;

  // If we have a subdomain (e.g., dr-robinson.example.com)
  // the first part is the slug
  const potentialSlug = parts[0];

  // Skip common non-doctor subdomains
  if (["www", "api", "admin", "mail", "ftp"].includes(potentialSlug)) {
    return null;
  }

  return potentialSlug;
}
