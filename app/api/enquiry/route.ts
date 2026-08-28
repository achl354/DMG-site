import { NextResponse } from "next/server";
import { Resend } from "resend";
import { PRODUCT_NAMES } from "@/lib/constants";

interface EnquiryPayload {
  name?: string;
  email?: string;
  phone?: string;
  organisation?: string;
  product?: string;
  message?: string;
  consent?: string;
}

/** Where every enquiry lands -- not secret, so hardcoded rather than an
 * env var (only the Resend API key below needs to be one). */
const ENQUIRY_TO_EMAIL = "sales@directmedgroup.com";

/**
 * Resend's own shared sandbox sender -- works immediately with no setup,
 * but only delivers to the email address the Resend account itself was
 * created with, not to ENQUIRY_TO_EMAIL above, until a real sending
 * domain is verified. Once directmedgroup.com (or a subdomain) is
 * verified with Resend, change this to an address on that domain, e.g.
 * "DMG Website <enquiries@directmedgroup.com>" -- deliverability and
 * trust are both better from a real domain than the shared sandbox one.
 */
const FROM_EMAIL = "DMG Website <onboarding@resend.dev>";

/**
 * Validates the enquiry, then emails it to ENQUIRY_TO_EMAIL via Resend.
 * Requires RESEND_API_KEY as an environment variable (set in Vercel's
 * project settings, from a Resend account's API Keys page) -- without
 * it, falls back to logging only (so local development doesn't need a
 * real key) but still reports success, since that's the existing
 * pre-Resend behaviour this replaces. With a key present, a real send
 * failure is reported back as an error rather than a false "sent".
 */
export async function POST(request: Request) {
  let payload: EnquiryPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, phone, organisation, product, message, consent } = payload;

  if (!name?.trim() || !email?.trim() || !message?.trim() || !consent) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const productLabel = product ? (PRODUCT_NAMES[product] ?? product) : "General enquiry";

  console.log("[enquiry] received", { name, email, product: productLabel });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[enquiry] RESEND_API_KEY not set -- logging only, no email sent");
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: ENQUIRY_TO_EMAIL,
    replyTo: email,
    subject: `New enquiry: ${productLabel} -- ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      organisation ? `Organisation: ${organisation}` : null,
      `Interested in: ${productLabel}`,
      "",
      "Message:",
      message,
    ]
      .filter((line) => line !== null)
      .join("\n"),
  });

  if (error) {
    console.error("[enquiry] Resend send failed", error);
    return NextResponse.json({ error: "Failed to send enquiry" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
