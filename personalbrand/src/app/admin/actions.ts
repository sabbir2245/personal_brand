"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentDoctor } from "@/lib/doctor";
import { markdownToHtml, slugify } from "@/lib/markdown";
import { dispatchPostToSubscribers } from "@/lib/email";

const supabase = () => createServerClient();

async function requireDoctor() {
  const doctor = await getCurrentDoctor();
  if (!doctor) throw new Error("Not authenticated");
  if (!doctor.is_onboarded) redirect("/onboarding");
  return doctor;
}

export async function savePost(formData: FormData) {
  const doctor = await requireDoctor();
  const id = formData.get("id")?.toString() ?? "";
  const title = formData.get("title")?.toString() ?? "";
  const slug = formData.get("slug")?.toString() || slugify(title);
  const md = formData.get("markdown")?.toString() ?? "";
  const excerpt = formData.get("excerpt")?.toString() ?? "";
  const featured_image = formData.get("featured_image")?.toString() ?? "";
  const is_published = formData.get("is_published") === "on";

  const payload = {
    doctor_id: doctor.id,
    title,
    slug,
    html_content: markdownToHtml(md),
    excerpt,
    featured_image,
  };

  const db = supabase();
  let postToDispatch: { id?: string; title: string; slug: string; html_content: string; excerpt?: string | null } | null = null;

  if (id) {
    const { data: existing } = await db.from("posts").select("is_published").eq("id", id).eq("doctor_id", doctor.id).maybeSingle();
    const shouldPublish = is_published && !existing?.is_published;

    const { data: updated, error } = await db
      .from("posts")
      .update({
        ...payload,
        is_published,
        ...(shouldPublish ? { published_at: new Date().toISOString() } : {}),
      })
      .eq("id", id)
      .eq("doctor_id", doctor.id)
      .select("id, title, slug, html_content, excerpt, is_published")
      .maybeSingle();

    if (error) {
      console.error("Error updating post:", error);
    } else if (updated && shouldPublish) {
      postToDispatch = updated;
    }
  } else {
    const { data: inserted, error } = await db
      .from("posts")
      .insert({
        ...payload,
        is_published,
        published_at: is_published ? new Date().toISOString() : null,
      })
      .select("id, title, slug, html_content, excerpt, is_published")
      .maybeSingle();

    if (error) {
      console.error("Error inserting post:", error);
    } else if (inserted && is_published) {
      postToDispatch = inserted;
    }
  }

  if (postToDispatch) {
    try {
      await dispatchPostToSubscribers(postToDispatch);
    } catch (e) {
      console.error("Error dispatching post to subscribers:", e);
    }
  }

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  redirect("/admin/posts");
}

export async function deletePost(formData: FormData) {
  const doctor = await requireDoctor();
  const id = formData.get("id")?.toString();
  if (!id) return;
  await supabase().from("posts").delete().eq("id", id).eq("doctor_id", doctor.id);
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}

export async function publishPost(formData: FormData) {
  const doctor = await requireDoctor();
  const id = formData.get("id")?.toString();
  if (!id) return;
  const db = supabase();
  const { data: post, error } = await db
    .from("posts")
    .update({ is_published: true, published_at: new Date().toISOString() })
    .eq("id", id)
    .eq("doctor_id", doctor.id)
    .select("id, title, slug, html_content, excerpt")
    .single();

  if (error) {
    console.error("Error publishing post:", error);
  } else if (post) {
    try {
      await dispatchPostToSubscribers(post);
    } catch (e) {
      console.error("Error dispatching post to subscribers:", e);
    }
  }

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}

export async function unpublishPost(formData: FormData) {
  const doctor = await requireDoctor();
  const id = formData.get("id")?.toString();
  if (!id) return;
  await supabase().from("posts").update({ is_published: false }).eq("id", id).eq("doctor_id", doctor.id);
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}

export async function savePortfolio(formData: FormData) {
  const doctor = await requireDoctor();
  const id = formData.get("id")?.toString() ?? "";
  const payload = {
    doctor_id: doctor.id,
    type: formData.get("type")?.toString() ?? "own",
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    url: formData.get("url")?.toString() ?? null,
    image: formData.get("image")?.toString() ?? null,
    tech_stack: (formData.get("tech_stack")?.toString() ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    is_published: formData.get("is_published") === "on",
  };
  if (id) {
    await supabase().from("portfolio_items").update(payload).eq("id", id).eq("doctor_id", doctor.id);
  } else {
    await supabase().from("portfolio_items").insert(payload);
  }
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  redirect("/admin/portfolio");
}

export async function deletePortfolio(formData: FormData) {
  const doctor = await requireDoctor();
  const id = formData.get("id")?.toString();
  if (!id) return;
  await supabase().from("portfolio_items").delete().eq("id", id).eq("doctor_id", doctor.id);
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
}

export async function saveEducation(formData: FormData) {
  const doctor = await requireDoctor();
  const id = formData.get("id")?.toString() ?? "";
  const payload = {
    doctor_id: doctor.id,
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    url: formData.get("url")?.toString() ?? "",
    image: formData.get("image")?.toString() ?? null,
    sort_order: Number(formData.get("sort_order")?.toString() ?? 0),
  };
  if (id) {
    await supabase().from("education_links").update(payload).eq("id", id).eq("doctor_id", doctor.id);
  } else {
    await supabase().from("education_links").insert(payload);
  }
  revalidatePath("/admin/education");
  revalidatePath("/education");
  redirect("/admin/education");
}

export async function deleteEducation(formData: FormData) {
  const doctor = await requireDoctor();
  const id = formData.get("id")?.toString();
  if (!id) return;
  await supabase().from("education_links").delete().eq("id", id).eq("doctor_id", doctor.id);
  revalidatePath("/admin/education");
  revalidatePath("/education");
}

export async function saveSettings(formData: FormData) {
  const doctor = await requireDoctor();
  const parseJson = (v: string) => {
    try {
      return JSON.parse(v);
    } catch {
      return {};
    }
  };
  const payload = {
    doctor_id: doctor.id,
    site_name: formData.get("site_name")?.toString() ?? "",
    tagline: formData.get("tagline")?.toString() ?? "",
    hero_headline: formData.get("hero_headline")?.toString() ?? "",
    hero_subtitle: formData.get("hero_subtitle")?.toString() ?? "",
    contact_email: formData.get("contact_email")?.toString() ?? "",
    social_links: parseJson(formData.get("social_links")?.toString() ?? "{}"),
    theme_colors: parseJson(formData.get("theme_colors")?.toString() ?? "{}"),
    doctor_name: formData.get("doctor_name")?.toString() ?? "",
    doctor_title: formData.get("doctor_title")?.toString() ?? "",
    doctor_qualifications: formData.get("doctor_qualifications")?.toString() ?? "",
    doctor_photo_url: formData.get("doctor_photo_url")?.toString() ?? "",
    doctor_about: formData.get("doctor_about")?.toString() ?? "",
    doctor_services: parseJson(formData.get("doctor_services")?.toString() ?? "[]"),
    doctor_bmdc_id: formData.get("doctor_bmdc_id")?.toString() ?? "",
    doctor_location: formData.get("doctor_location")?.toString() ?? "",
  };
  const { data } = await supabase().from("site_settings").select("id").eq("doctor_id", doctor.id).maybeSingle();
  if (data?.id) {
    await supabase().from("site_settings").update(payload).eq("id", data.id);
  } else {
    await supabase().from("site_settings").insert(payload);
  }
  revalidatePath("/admin/settings");
  revalidatePath("/");
}

export async function unsubscribeSubscriber(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) return;
  await supabase().from("subscribers").update({ status: "unsubscribed" }).eq("id", id);
  revalidatePath("/admin/subscribers");
}

export async function deleteSubscriber(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) return;
  await supabase().from("subscribers").delete().eq("id", id);
  revalidatePath("/admin/subscribers");
}

export async function addSubscriber(formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
  const { data: existing } = await supabase()
    .from("subscribers")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existing) {
    await supabase().from("subscribers").update({ status: "active" }).eq("id", existing.id);
  } else {
    await supabase().from("subscribers").insert({ email, status: "active" });
  }
  revalidatePath("/admin/subscribers");
}

export async function saveHospitalAffiliation(formData: FormData) {
  const doctor = await requireDoctor();
  const id = formData.get("id")?.toString() ?? "";
  const payload = {
    doctor_id: doctor.id,
    name: formData.get("name")?.toString() ?? "",
    status: formData.get("status")?.toString() ?? "current",
    sort_order: Number(formData.get("sort_order")?.toString() ?? 0),
  };
  if (id) {
    await supabase().from("hospital_affiliations").update(payload).eq("id", id).eq("doctor_id", doctor.id);
  } else {
    await supabase().from("hospital_affiliations").insert(payload);
  }
  revalidatePath("/admin/hospitals");
  revalidatePath("/");
  redirect("/admin/hospitals");
}

export async function deleteHospitalAffiliation(formData: FormData) {
  const doctor = await requireDoctor();
  const id = formData.get("id")?.toString();
  if (!id) return;
  await supabase().from("hospital_affiliations").delete().eq("id", id).eq("doctor_id", doctor.id);
  revalidatePath("/admin/hospitals");
  revalidatePath("/");
}

export async function addMedia(formData: FormData) {
  const doctor = await requireDoctor();
  const url = formData.get("url")?.toString().trim() ?? "";
  const title = formData.get("title")?.toString().trim() ?? "";
  if (!url || !title) return;
  await supabase().from("media").insert({ doctor_id: doctor.id, embed_url: url, title, sort_order: 0 });
  revalidatePath("/admin/media");
  revalidatePath("/media");
  redirect("/admin/media");
}

export async function deleteMedia(formData: FormData) {
  const doctor = await requireDoctor();
  const id = formData.get("id")?.toString();
  if (!id) return;
  await supabase().from("media").delete().eq("id", id).eq("doctor_id", doctor.id);
  revalidatePath("/admin/media");
  revalidatePath("/media");
}

export async function updateDoctorSlug(formData: FormData) {
  const doctor = await requireDoctor();
  const slug = formData.get("slug")?.toString() ?? "";
  if (!slug || !/^[a-z0-9\-]+$/.test(slug)) {
    throw new Error("Invalid slug");
  }

  // Check uniqueness
  const { data: existing } = await supabase()
    .from("doctors")
    .select("id")
    .eq("slug", slug)
    .neq("id", doctor.id)
    .maybeSingle();
  if (existing) {
    throw new Error("Slug already taken");
  }

  await supabase().from("doctors").update({ slug }).eq("id", doctor.id);
  revalidatePath("/admin/settings");
  revalidatePath("/");
}
