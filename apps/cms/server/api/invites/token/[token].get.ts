import { invites } from '@blog-engine/db/schema'
import { and, eq, isNull } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')
  if (!token) throw createError({ statusCode: 400, statusMessage: 'Missing token' })

  const db = useDb()
  const [invite] = await db
    .select({
      id: invites.id,
      email: invites.email,
      role: invites.role,
      expiresAt: invites.expiresAt,
    })
    .from(invites)
    .where(and(eq(invites.token, token), isNull(invites.acceptedAt)))

  if (!invite) throw createError({ statusCode: 404, statusMessage: 'Invite not found' })
  if (invite.expiresAt < new Date()) {
    throw createError({ statusCode: 410, statusMessage: 'Invite expired' })
  }

  return { invite }
})
