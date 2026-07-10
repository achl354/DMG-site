import { NextResponse } from "next/server";

interface EnquiryPayload {
  name?: string;
  email?: string;
  phone?: string;
  organisation?: string;
  product?: string;
  message?: string;
  consent?: string;
}

/**
 * Validates and accepts the enquiry. Delivery (email/CRM) is not wired up
 * yet -- this confirms the form contract end-to-end so the frontend can be
 * built and tested now; connecting a real notification channel is a
 * separate follow-up once JDHG decides where enquiries should land.
 */
export async function POST(request: Request) {
  let payload: EnquiryPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, message, consent } = payload;

  if (!name?.trim() || !email?.trim() || !message?.trim() || !consent) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  console.log("[enquiry] received", { name, email, product: payload.product });

  return NextResponse.json({ ok: true });
}
