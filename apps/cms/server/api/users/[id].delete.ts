import { users } from '@blog-engine/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const actor = await requireRole(event, 'admin')
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing user id' })
  if (id === actor.userId) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot delete yourself' })
  }

  const db = useDb()
  const [removed] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({ id: users.id, email: users.email })

  if (!removed) throw createError({ statusCode: 404, statusMessage: 'User not found' })

  await logAudit({
    userId: actor.userId,
    action: 'user.deleted',
    entityType: 'user',
    entityId: id,
    diff: { email: removed.email },
  })

  return { ok: true }
})
