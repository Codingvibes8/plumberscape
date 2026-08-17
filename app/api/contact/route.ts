import { NextRequest, NextResponse } from "next/server"

import { deliverContactLead, generateReferenceId } from "@/lib/contact-service"
import { getClientIp, rateLimitByIp } from "@/lib/rate-limit"
import { contactSchema } from "@/lib/validations/contact"

export const runtime = "nodejs"

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5
const MIN_FORM_TIME_MS = 3_000

function logSubmission(
  data: Record<string, unknown>,
  extras: Record<string, unknown>,
  ip: string
) {
  const email =
    typeof data.email === "string"
      ? data.email.replace(/^(.)(.*)@(.*)$/, "$1***@$3")
      : undefined

  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      event: "contact.submission",
      ...extras,
      email,
      serviceType: data.serviceType,
      projectSize: data.projectSize,
      ip,
    })
  )
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body" },
      { status: 400 }
    )
  }

  const raw = (body ?? {}) as Record<string, unknown>

  // Honeypot: silently accept so bots never learn they were caught.
  if (typeof raw.honeypot === "string" && raw.honeypot.length > 0) {
    logSubmission(raw, { outcome: "blocked", reason: "honeypot" }, ip)
    return NextResponse.json(
      { ok: true, referenceId: generateReferenceId() },
      { status: 201 }
    )
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const [field, issues] of Object.entries(
      parsed.error.flatten().fieldErrors
    )) {
      if (issues.length > 0) {
        fieldErrors[field] = issues
      }
    }
    return NextResponse.json(
      { ok: false, message: "Please correct the highlighted fields", fieldErrors },
      { status: 400 }
    )
  }

  // Rate limit per IP.
  const rate = rateLimitByIp(req, {
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX,
  })
  if (!rate.success) {
    logSubmission(raw, { outcome: "blocked", reason: "rate_limit" }, ip)
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please wait a minute and try again." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    )
  }

  // Reject submissions made unrealistically fast (automated bots).
  if (
    typeof parsed.data.clientTime === "number" &&
    Number.isFinite(parsed.data.clientTime) &&
    Date.now() - parsed.data.clientTime < MIN_FORM_TIME_MS
  ) {
    logSubmission(parsed.data, { outcome: "blocked", reason: "too_fast" }, ip)
    return NextResponse.json(
      { ok: true, referenceId: generateReferenceId() },
      { status: 201 }
    )
  }

  try {
    const referenceId = await deliverContactLead(parsed.data, { ip })
    logSubmission(parsed.data, { outcome: "delivered", referenceId }, ip)
    return NextResponse.json({ ok: true, referenceId }, { status: 201 })
  } catch (error) {
    console.error("[contact] delivery failed", error)
    return NextResponse.json(
      {
        ok: false,
        message:
          "We couldn't process your request right now. Please call us on 020 7123 4567 or try again shortly.",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, message: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } }
  )
}