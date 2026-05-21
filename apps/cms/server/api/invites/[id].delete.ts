import { invites } from '@blog-engine/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const actor = await requireRole(event, 'admin')
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing invite id' })

  const db = useDb()
  const [removed] = await db
    .delete(invites)
    .where(eq(invites.id, id))
    .returning({ id: invites.id, email: invites.email })

  if (!removed) throw createError({ statusCode: 404, statusMessage: 'Invite not found' })

  await logAudit({
    userId: actor.userId,
    action: 'invite.revoked',
    entityType: 'invite',
    entityId: id,
    diff: { email: removed.email },
  })

  return { ok: true }
})
