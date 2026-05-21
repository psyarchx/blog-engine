import { invites, users } from '@blog-engine/db/schema'
import { and, eq, isNull } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ token?: unknown; name?: unknown; password?: unknown }>(event)
  const token = typeof body.token === 'string' ? body.token : ''
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  if (!token) throw createError({ statusCode: 400, statusMessage: 'Missing token' })
  if (!name) throw createError({ statusCode: 400, statusMessage: 'Name required' })
  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters' })
  }

  const db = useDb()
  const [invite] = await db
    .select()
    .from(invites)
    .where(and(eq(invites.token, token), isNull(invites.acceptedAt)))

  if (!invite) throw createError({ statusCode: 404, statusMessage: 'Invite not found' })
  if (invite.expiresAt < new Date()) {
    throw createError({ statusCode: 410, statusMessage: 'Invite expired' })
  }

  const auth = useServerAuth()
  // Creates the user via better-auth (handles password hashing + accounts row).
  const result = await auth.api.signUpEmail({
    body: { email: invite.email, password, name },
  })
  if (!result?.user) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create user' })
  }

  // Promote to the invited role (signUp creates as default 'author').
  await db.update(users).set({ role: invite.role, updatedAt: new Date() }).where(eq(users.id, result.user.id))
  await db.update(invites).set({ acceptedAt: new Date() }).where(eq(invites.id, invite.id))

  await logAudit({
    userId: result.user.id,
    action: 'invite.accepted',
    entityType: 'user',
    entityId: result.user.id,
    diff: { email: invite.email, role: invite.role },
  })

  return { ok: true }
})
