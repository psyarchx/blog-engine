export interface SendEmailInput {
  to: string
  subject: string
  text: string
  html?: string
}

/**
 * Sends an email via Resend when RESEND_API_KEY is set, otherwise logs the
 * message to stdout so invite/magic-link flows work offline in dev.
 */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  const config = useRuntimeConfig()
  const apiKey = config.resendApiKey

  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.log('[email:dev]', {
      to: input.to,
      subject: input.subject,
      text: input.text,
    })
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Blog Engine <onboarding@resend.dev>',
      to: [input.to],
      subject: input.subject,
      text: input.text,
      html: input.html,
    }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw createError({
      statusCode: 502,
      statusMessage: `Email send failed: ${res.status} ${detail}`,
    })
  }
}
