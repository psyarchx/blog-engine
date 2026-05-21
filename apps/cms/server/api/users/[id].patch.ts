import { users } from '@blog-engine/db/schema'
import { eq } from 'drizzle-orm'
import { isRole } from '@blog-engine/auth'

export default defineEventHandler(async (event) => {
  const actor = await requireRole(event, 'admin')
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing user id' })

  const body = await readBody<{ role?: unknown; name?: unknown }>(event)
  const patch: { role?: 'admin' | 'editor' | 'author'; name?: string; updatedAt: Date } = {
    updatedAt: new Date(),
  }
  if (body.role !== undefined) {
    if (!isRole(body.role)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid role' })
    }
    patch.role = body.role
  }
  if (typeof body.name === 'string' && body.name.trim()) {
    patch.name = body.name.trim()
  }

  const db = useDb()
  const [updated] = await db
    .update(users)
    .set(patch)
    .where(eq(users.id, id))
    .returning({ id: users.id, email: users.email, role: users.role, name: users.name })

  if (!updated) throw createError({ statusCode: 404, statusMessage: 'User not found' })

  await logAudit({
    userId: actor.userId,
    action: 'user.updated',
    entityType: 'user',
    entityId: id,
    diff: patch,
  })

  return { user: updated }
})
