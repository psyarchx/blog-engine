import { invites, users } from '@blog-engine/db/schema'
import { eq } from 'drizzle-orm'
import { isRole } from '@blog-engine/auth'

const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

export default defineEventHandler(async (event) => {
  const actor = await requireRole(event, 'admin')
  const config = useRuntimeConfig()
  const db = useDb()

  const body = await readBody<{ email?: unknown; role?: unknown }>(event)
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || !email.includes('@')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email' })
  }
  if (!isRole(body.role)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid role' })
  }
  const role = body.role

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email))
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'User with this email already exists' })
  }

  const token = createUrlToken(32)
  const expiresAt = new Date(Date.now() + INVITE_TTL_MS)

  const [created] = await db
    .insert(invites)
    .values({
      email,
      role,
      token,
      invitedBy: actor.userId,
      expiresAt,
    })
    .returning({ id: invites.id, email: invites.email, role: invites.role, expiresAt: invites.expiresAt })

  const inviteUrl = `${config.public.cmsOrigin}/accept-invite/${token}`
  await sendEmail({
    to: email,
    subject: `You're invited to ${config.public.cmsName}`,
    text: `${actor.name} invited you to join ${config.public.cmsName} as ${role}.\n\nAccept the invite:\n${inviteUrl}\n\nThis link expires in 7 days.`,
  })

  await logAudit({
    userId: actor.userId,
    action: 'invite.sent',
    entityType: 'invite',
    entityId: created?.id,
    diff: { email, role },
  })

  return { invite: created }
})
