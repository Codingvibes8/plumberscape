import fs from "node:fs"
import path from "node:path"

import type { ContactFormData } from "@/lib/validations/contact"

const REFERENCE_PREFIX = "PLB"

export function generateReferenceId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${REFERENCE_PREFIX}-${timestamp}${random}`
}

export interface ContactLead extends ContactFormData {
  referenceId: string
  submittedAt: string
  ip?: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function buildEmailHtml(lead: ContactLead): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#64748b;width:180px;vertical-align:top">${escapeHtml(
      label
    )}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#0a1628;vertical-align:top">${escapeHtml(
      value
    )}</td></tr>`

  return `<!DOCTYPE html>
<html lang="en-GB">
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;padding:24px">
    <tr><td>
      <table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
        <tr>
          <td style="background:#0a1628;padding:20px 24px">
            <h1 style="margin:0;color:#faf7f2;font-size:20px;font-family:Georgia,serif">New Quote Request</h1>
            <p style="margin:4px 0 0;color:#b87333;font-size:13px">Reference: ${escapeHtml(lead.referenceId)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 16px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${row("Name", lead.name)}
              ${row("Email", lead.email)}
              ${row("Phone", lead.phone || "-")}
              ${row("Postcode", lead.postcode || "-")}
              ${row("Service", lead.serviceType)}
              ${row("Project size", lead.projectSize)}
              ${row("Budget range", lead.budgetRange)}
              ${row("Preferred contact", lead.preferredContactMethod)}
              ${row("Preferred time", lead.preferredTime)}
              <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#64748b;width:180px;vertical-align:top">Message</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#0a1628;vertical-align:top">${escapeHtml(
                lead.message
              )}</td></tr>
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function getLeadLogPath(): string {
  const configured = process.env.CONTACT_LEAD_LOG
  if (configured) {
    return path.isAbsolute(configured)
      ? configured
      : path.join(process.cwd(), configured)
  }
  return path.join(process.cwd(), "logs", "leads.jsonl")
}

async function persistLead(lead: ContactLead): Promise<void> {
  const line = JSON.stringify(lead)
  console.log(`[contact] ${line}`)

  try {
    const logPath = getLeadLogPath()
    fs.mkdirSync(path.dirname(logPath), { recursive: true })
    fs.appendFileSync(logPath, `${line}\n`)
  } catch (error) {
    console.error("[contact] failed to persist lead log", error)
  }
}

async function sendViaResend(lead: ContactLead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_EMAIL_TO
  if (!apiKey || !to) {
    console.warn(
      "[contact] RESEND_API_KEY / CONTACT_EMAIL_TO not configured, skipping email delivery"
    )
    return
  }

  const from =
    process.env.CONTACT_FROM_EMAIL ?? "PlumbScape <onboarding@resend.dev>"
  const subject = `New quote request: ${lead.serviceType} (${lead.referenceId})`

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email,
      subject,
      html: buildEmailHtml(lead),
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Resend API error ${response.status}: ${detail}`)
  }
}

export async function deliverContactLead(
  data: ContactFormData,
  opts: { ip?: string } = {}
): Promise<string> {
  const referenceId = generateReferenceId()

  const lead: ContactLead = {
    ...data,
    referenceId,
    submittedAt: new Date().toISOString(),
    ip: opts.ip,
  }

  await persistLead(lead)

  try {
    await sendViaResend(lead)
  } catch (error) {
    console.error("[contact] email delivery failed", error)
  }

  return referenceId
}