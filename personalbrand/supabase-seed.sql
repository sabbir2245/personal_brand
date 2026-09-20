-- ============================================
-- Seed sample content (run after supabase-schema.sql)
-- Dr. Md. Shamsul Ahsan Maksud
-- IMPORTANT: Replace 'YOUR_CLERK_USER_ID' with your actual Clerk user ID
-- ============================================

-- Step 1: Create the doctor account
insert into public.doctors (clerk_user_id, slug, display_name, email, is_onboarded)
values (
  'user_3HH8ygxHY6FlANJFcNZASl5kunb',
  'dr-maksud',
  'Dr. Md. Shamsul Ahsan Maksud',
  'contact@bdpsychiatriccare.com',
  true
)
on conflict (clerk_user_id) do update set
  slug = 'dr-maksud',
  display_name = 'Dr. Md. Shamsul Ahsan Maksud',
  is_onboarded = true;

-- Step 2: Get the doctor_id we just created
do $$
declare
  v_doctor_id uuid;
begin
  select id into v_doctor_id from public.doctors where slug = 'dr-maksud';

  -- Site settings
  insert into public.site_settings (doctor_id, site_name, tagline, hero_headline, hero_subtitle, contact_email, social_links, theme_colors, doctor_name, doctor_title, doctor_qualifications, doctor_photo_url, doctor_about, doctor_bmdc_id, doctor_location, doctor_services)
  values (
    v_doctor_id,
    'Dr. Md. Shamsul Ahsan Maksud',
    'Adult Psychiatry & Sexual Medicine in Dhaka | Bangladesh Psychiatric Care',
    'Adult Psychiatry & Sexual Medicine',
    'Psychiatrist and Sexual Medicine specialist helping patients in Dhaka with assessment, treatment planning and ongoing care.',
    'contact@bdpsychiatriccare.com',
    '{"facebook":"https://bdpsychiatriccare.com/","youtube":"https://youtu.be/ef5gdmvms6w","x":"https://bdpsychiatriccare.com/"}'::jsonb,
    '{"primary":"#0f766e","accent":"#0e7490"}'::jsonb,
    'Dr. Md. Shamsul Ahsan Maksud',
    'Associate Professor, Bangladesh Medical University',
    'MBBS, M Phil (Psychiatry), FCPS (Psychiatry), FECSM (Sexual Medicine), Fellowship in Sexology',
    'https://bdpsychiatriccare.com/img/psychiatrists/10.png',
    'Dedicated psychiatrist and oral medicine specialist with over a decade of experience in adult psychiatry, addiction medicine, and oral health. Committed to providing comprehensive mental health care and advancing medical education in Bangladesh.',
    'A30070',
    'Dhaka, Bangladesh',
    '[{"title":"Adult Psychiatry","description":"Comprehensive evaluation and treatment of mental health disorders in adults."},{"title":"Sexual Medicine","description":"Specialist assessment and management of sexual medicine concerns."},{"title":"Substance De-Addiction","description":"Co-ordinator, Substance De-Addiction Clinic, Bangladesh Medical University."},{"title":"Counselling & Therapy","description":"Individual counselling, psychoeducation and family guidance."}]'::jsonb
  )
  on conflict (doctor_id) do update set
    site_name = excluded.site_name,
    doctor_name = excluded.doctor_name;

  -- Portfolio items
  insert into public.portfolio_items (doctor_id, type, title, description, tech_stack, url, is_published)
  values
    (v_doctor_id, 'own',    'Adult Psychiatry',         'Assessment and treatment planning for adult psychiatric conditions.', array['Psychiatry'], 'https://bdpsychiatriccare.com/adult_psychiatry.php', true),
    (v_doctor_id, 'own',    'Sexual Medicine',          'Specialist assessment and management of sexual medicine concerns.',   array['Sexual Medicine'], 'https://bdpsychiatriccare.com/sexual_medicine.php', true),
    (v_doctor_id, 'client', 'Substance De-Addiction',   'Co-ordinator, Substance De-Addiction Clinic, Bangladesh Medical University.', array['Addiction'], 'https://bdpsychiatriccare.com/addiction.php', true),
    (v_doctor_id, 'client', 'Psychoeducation & Family', 'Family guidance and psychoeducation as part of patient-centred care.',   array['Patient Care'], 'https://bdpsychiatriccare.com/psychotherapy.php', true),
    (v_doctor_id, 'own',    'Orthopedics & Bone Health', 'Assessment and management of bone, joint and musculoskeletal conditions.', array['Orthopedics'], 'https://bdpsychiatriccare.com/consultant/dr-md-shamsul-ahsan-maksud', true),
    (v_doctor_id, 'own',    'Oral & Dental Care',       'Routine dental consultation and oral health guidance.',                    array['Dental'],     'https://bdpsychiatriccare.com/consultant/dr-md-shamsul-ahsan-maksud', true),
    (v_doctor_id, 'own',    'Counselling & Therapy',    'Individual counselling, psychoeducation and family guidance.',             array['Therapy'],    'https://bdpsychiatriccare.com/psychotherapy.php', true);

  -- Education links
  insert into public.education_links (doctor_id, title, description, url, sort_order)
  values
    (v_doctor_id, 'MBBS (Psychiatry)',          'Chittagong Medical College, January 1999.',                                                      'https://bdpsychiatriccare.com/consultant/dr-md-shamsul-ahsan-maksud', 1),
    (v_doctor_id, 'M Phil (Psychiatry)',        'Bangladesh Medical University, 2006.',                                                         'https://bdpsychiatriccare.com/consultant/dr-md-shamsul-ahsan-maksud', 2),
    (v_doctor_id, 'FCPS (Psychiatry)',          'Bangladesh Medical University, 2010.',                                                         'https://bdpsychiatriccare.com/consultant/dr-md-shamsul-ahsan-maksud', 3),
    (v_doctor_id, 'FECSM (Sexual Medicine)',    'Fellowship exam, Amsterdam, Netherlands, December 2012 — first in Bangladesh.',                'https://bdpsychiatriccare.com/consultant/dr-md-shamsul-ahsan-maksud', 4),
    (v_doctor_id, 'Fellowship in Sexology',     'European Federation of Sexology, 2014.',                                                       'https://bdpsychiatriccare.com/consultant/dr-md-shamsul-ahsan-maksud', 5),
    (v_doctor_id, 'President Elect, SASSM',     'South Asian Society for Sexual Medicine, since 2019.',                                         'https://bdpsychiatriccare.com/consultant/dr-md-shamsul-ahsan-maksud', 6);

  -- Media gallery
  insert into public.media (doctor_id, title, type, embed_url, thumbnail, sort_order)
  values
    (v_doctor_id, 'Sex Headache', 'youtube', 'https://youtu.be/ef5gdmvms6w', 'https://i.ytimg.com/vi/ef5gdmvms6w/hqdefault.jpg', 1),
    (v_doctor_id, 'Transgender',  'youtube', 'https://youtu.be/5jnQwXclhRk', 'https://i.ytimg.com/vi/5jnQwXclhRk/hqdefault.jpg', 2);

  -- Posts
  insert into public.posts (doctor_id, title, slug, html_content, excerpt, is_published, published_at)
  values
    (v_doctor_id, 'Understanding Adult Psychiatry: When to Seek Help', 'understanding-adult-psychiatry', '<p>Psychiatric assessment covers diagnosis, treatment planning and follow-up. Here is what to expect from a consultation and when it may help to reach out.</p>', 'A practical overview of psychiatric assessment, treatment planning and ongoing care.', false, null),
    (v_doctor_id, 'An Introduction to Sexual Medicine', 'introduction-to-sexual-medicine', '<p>Sexual medicine addresses a range of concerns through specialist assessment and evidence-informed management. This is a gentle introduction for patients and families.</p>', 'A guide to sexual medicine assessment and care.', false, null),
    (v_doctor_id, 'Coping with Stress: A Psychiatrist''s Guide', 'coping-with-stress', '<p>Stress is a natural part of life, but when it becomes overwhelming it can affect mood sleep and overall health. Here are practical strategies for managing stress from a psychiatric perspective.</p>', 'Practical strategies for managing stress from a psychiatric perspective.', false, null);

  raise notice 'Seed complete for doctor: %', v_doctor_id;
end $$;
