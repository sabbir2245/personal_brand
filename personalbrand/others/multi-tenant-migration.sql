-- ============================================
-- Migration: Add multi-tenant support
-- Run AFTER the new supabase-schema.sql
-- This migrates existing data to the new structure
-- ============================================

-- Step 1: Create a default doctor account for existing data
-- Replace 'YOUR_CLERK_USER_ID' with your actual Clerk user ID
-- You can find it in the Clerk dashboard or from your auth token

do $$
declare
  default_doctor_id uuid;
  default_user_id text := 'YOUR_CLERK_USER_ID'; -- <-- CHANGE THIS
begin
  -- Create the default doctor
  insert into public.doctors (clerk_user_id, slug, display_name, email, is_onboarded)
  values (
    default_user_id,
    'dr-maksud',
    'Dr. Md. Shamsul Ahsan Maksud',
    'contact@bdpsychiatriccare.com',
    true
  )
  returning id into default_doctor_id;

  -- Update site_settings to link to the doctor
  update public.site_settings set doctor_id = default_doctor_id where doctor_id is null;

  -- Update posts to link to the doctor
  update public.posts set doctor_id = default_doctor_id where doctor_id is null;

  -- Update portfolio_items to link to the doctor
  update public.portfolio_items set doctor_id = default_doctor_id where doctor_id is null;

  -- Update education_links to link to the doctor
  update public.education_links set doctor_id = default_doctor_id where doctor_id is null;

  -- Update media to link to the doctor
  update public.media set doctor_id = default_doctor_id where doctor_id is null;

  -- Update messages to link to the doctor
  update public.messages set doctor_id = default_doctor_id where doctor_id is null;

  raise notice 'Migration complete. Default doctor ID: %', default_doctor_id;
end $$;

-- Step 2: Add NOT NULL constraints after data migration
-- (Run these only after confirming data is migrated)

-- alter table public.site_settings alter column doctor_id set not null;
-- alter table public.posts alter column doctor_id set not null;
-- alter table public.portfolio_items alter column doctor_id set not null;
-- alter table public.education_links alter column doctor_id set not null;
-- alter table public.media alter column doctor_id set not null;
