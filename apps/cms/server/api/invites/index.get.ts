import { invites, users } from '@blog-engine/db/schema'
import { desc, eq, isNull } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')
  const db = useDb()

  const rows = await db
    .select({
      id: invites.id,
      email: invites.email,
      role: invites.role,
      invitedByName: users.name,
      invitedByEmail: users.email,
      expiresAt: invites.expiresAt,
      createdAt: invites.createdAt,
    })
    .from(invites)
    .leftJoin(users, eq(users.id, invites.invitedBy))
    .where(isNull(invites.acceptedAt))
    .orderBy(desc(invites.createdAt))

  return { invites: rows }
})
