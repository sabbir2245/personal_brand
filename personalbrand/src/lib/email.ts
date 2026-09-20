import { Resend } from "resend";
import { createServerClient } from "./supabase/server";

const FROM = process.env.RESEND_FROM || "onboarding@resend.dev";

function createResend() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  try {
    return new Resend(process.env.RESEND_API_KEY);
  } catch {
    return null;
  }
}

export const resend = createResend();

export async function sendWelcomeEmail(email: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const unsubUrl = `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(email)}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #171717; line-height: 1.6;">
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Welcome — you're subscribed</h1>
      <p>Thanks for subscribing to updates from Dr. Md. Shamsul Ahsan Maksud.</p>
      <p>You'll get mental health insights and new articles straight to your inbox.</p>
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
      <p style="font-size: 12px; color: #888;"><a href="${unsubUrl}" style="color: #666; text-decoration: underline;">Unsubscribe</a></p>
    </div>
  `;

  if (resend) {
    try {
      const response = await resend.emails.send({
        from: FROM,
        to: email,
        subject: "Welcome — you're subscribed",
        html,
      });

      if (response.error) {
        console.error(`[Resend Error] Failed sending welcome email to ${email}:`, response.error);
        return { success: false, error: response.error };
      }

      console.log(`[Resend Success] Sent welcome email to ${email}, id:`, response.data?.id);
      return { success: true, data: response.data };
    } catch (err) {
      console.error(`[Resend Exception] Error sending welcome email to ${email}:`, err);
      return { success: false, error: err };
    }
  }

  // Fallback: console.log the email content (useful when Resend is unreachable or key not set)
  console.log("=== Welcome Email (mock) ===");
  console.log(`To: ${email}`);
  console.log(`Subject: Welcome — you're subscribed`);
  console.log(html);
  console.log("=== End mock ===");
  return { error: null, success: true };
}

export async function sendNewsletterEmail(
  email: string,
  opts: { title: string; html: string; excerpt?: string | null; url: string },
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const unsubUrl = `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(email)}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #171717; line-height: 1.6;">
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #111;">${opts.title}</h1>
      ${opts.excerpt ? `<p style="font-size: 16px; color: #555; font-style: italic; margin-bottom: 20px;">${opts.excerpt}</p>` : ""}
      <div style="font-size: 15px; color: #333; margin-bottom: 24px;">
        ${opts.html}
      </div>
      <div style="margin-top: 30px; margin-bottom: 30px;">
        <a href="${opts.url}" style="display: inline-block; background-color: #0f766e; color: #ffffff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px;">
          Read full article on the site
        </a>
      </div>
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
      <p style="font-size: 12px; color: #888;">
        You received this email because you subscribed to updates from Dr. Md. Shamsul Ahsan Maksud.<br />
        <a href="${unsubUrl}" style="color: #666; text-decoration: underline;">Unsubscribe</a>
      </p>
    </div>
  `;

  if (resend) {
    try {
      const response = await resend.emails.send({
        from: FROM,
        to: email,
        subject: opts.title,
        html,
      });

      if (response.error) {
        console.error(`[Resend Error] Failed sending newsletter to ${email}:`, response.error);
        return { success: false, error: response.error };
      }

      console.log(`[Resend Success] Sent newsletter to ${email}, id:`, response.data?.id);
      return { success: true, data: response.data };
    } catch (err) {
      console.error(`[Resend Exception] Error sending newsletter to ${email}:`, err);
      return { success: false, error: err };
    }
  }

  // Fallback: console.log the email content (useful when Resend is unreachable or key not set)
  console.log("=== Newsletter Email (mock) ===");
  console.log(`To: ${email}`);
  console.log(`Subject: ${opts.title}`);
  console.log(html);
  console.log("=== End mock ===");
  return { error: null, success: true };
}

/**
 * Dispatches a published post to all active subscribers and includes
 * the admin/contact email so the owner always receives a copy.
 */
export async function dispatchPostToSubscribers(post: {
  id?: string;
  title: string;
  slug: string;
  html_content: string;
  excerpt?: string | null;
}) {
  const supabase = createServerClient();

  // 1. Fetch all active subscribers
  const { data: subscribers, error: subError } = await supabase
    .from("subscribers")
    .select("email")
    .eq("status", "active");

  if (subError) {
    console.error("Error fetching subscribers:", subError);
  }

  // 2. Fetch admin / contact email from site_settings or env as guaranteed recipient
  let adminEmail = process.env.ADMIN_EMAIL || process.env.NOTIFICATION_EMAIL;
  if (!adminEmail) {
    try {
      const { data: settings } = await supabase
        .from("site_settings")
        .select("contact_email")
        .limit(1)
        .maybeSingle();
      if (settings?.contact_email) {
        adminEmail = settings.contact_email;
      }
    } catch (e) {
      console.error("Error fetching site_settings contact_email:", e);
    }
  }

  // 3. Build unique list of recipient emails
  const recipientSet = new Set<string>();

  if (subscribers && subscribers.length > 0) {
    subscribers.forEach((s) => {
      if (s.email && s.email.trim()) {
        recipientSet.add(s.email.trim().toLowerCase());
      }
    });
  }

  // Always include admin/owner email if available so the owner gets at least one email
  if (adminEmail && adminEmail.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail.trim())) {
    recipientSet.add(adminEmail.trim().toLowerCase());
  }

  const recipients = Array.from(recipientSet);
  if (recipients.length === 0) {
    console.log("No subscribers or admin email found to dispatch post.");
    return { dispatched: 0, total: 0, recipients: [] };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${siteUrl}/blog/${post.slug}`;

  console.log(`Dispatching post "${post.title}" to ${recipients.length} recipients:`, recipients);

  const results = await Promise.allSettled(
    recipients.map((email) =>
      sendNewsletterEmail(email, {
        title: post.title,
        html: post.html_content,
        excerpt: post.excerpt,
        url,
      }),
    ),
  );

  let successCount = 0;
  results.forEach((r, i) => {
    if (r.status === "fulfilled" && (r.value as any)?.success !== false) {
      successCount++;
    } else {
      console.error(
        `Failed to send newsletter to ${recipients[i]}:`,
        r.status === "rejected" ? r.reason : (r.value as any)?.error,
      );
    }
  });

  return { dispatched: successCount, total: recipients.length, recipients };
}