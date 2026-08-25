/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Accepts a plain HTML form POST (no JavaScript required client-side),
 * applies honeypot + fast-submit spam checks, and forwards the message
 * to the mailbox via the Resend API.
 *
 * Environment variables (set in Cloudflare Pages → Settings → Variables):
 *   RESEND_API_KEY  — secret. Resend API key for the ninetygroup.co.uk domain.
 *   CONTACT_TO      — destination mailbox, e.g. hello@ninetygroup.co.uk
 *   CONTACT_FROM    — verified sender, e.g. website@ninetygroup.co.uk
 *                     (must be on a domain verified in Resend — see DEPLOY.md;
 *                     the Resend DNS records are additive and must not touch
 *                     the existing Microsoft 365 mail records)
 *
 * Responses are 303 redirects back to the contact page, where CSS :target
 * reveals the matching status message — so the flow works without JS.
 */

const OK = "/contact.html#sent";
const ERR = "/contact.html#error";

function redirect(to) {
  return new Response(null, { status: 303, headers: { Location: to } });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

export async function onRequestPost({ request, env }) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return redirect(ERR);
  }

  const name = (form.get("name") || "").toString().trim().slice(0, 200);
  const company = (form.get("company") || "").toString().trim().slice(0, 200);
  const email = (form.get("email") || "").toString().trim().slice(0, 320);
  const phone = (form.get("phone") || "").toString().trim().slice(0, 50);
  const message = (form.get("message") || "").toString().trim().slice(0, 5000);

  // --- Spam checks ---------------------------------------------------------
  // 1. Honeypot: the off-canvas "website" field must be empty.
  if ((form.get("website") || "").toString().trim() !== "") {
    // Pretend success so bots don't learn anything.
    return redirect(OK);
  }
  // 2. Fast-submit: if JS stamped a load time and the form came back in
  //    under 3 seconds, it's a bot. An empty stamp (no JS) is allowed.
  const ts = parseInt((form.get("form_ts") || "").toString(), 10);
  if (!Number.isNaN(ts) && Date.now() - ts < 3000) {
    return redirect(OK);
  }
  // -------------------------------------------------------------------------

  if (!name || !email || !message || !email.includes("@")) {
    return redirect(ERR);
  }

  const lines = [
    `Name:    ${name}`,
    company ? `Company: ${company}` : null,
    `Email:   ${email}`,
    phone ? `Phone:   ${phone}` : null,
    "",
    message,
  ].filter((l) => l !== null);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Ninety Utilities website <${env.CONTACT_FROM}>`,
        to: [env.CONTACT_TO],
        reply_to: email,
        subject: `Website enquiry from ${name}${company ? ` (${company})` : ""}`,
        text: lines.join("\n"),
        html: `<pre style="font-family:inherit;white-space:pre-wrap">${escapeHtml(lines.join("\n"))}</pre>`,
      }),
    });
    if (!res.ok) return redirect(ERR);
  } catch {
    return redirect(ERR);
  }

  return redirect(OK);
}

// Anything other than POST (GET, HEAD, …) → back to the form.
// Pages routes POST to onRequestPost above; this catches the rest.
export async function onRequestGet() {
  return redirect("/contact.html");
}
