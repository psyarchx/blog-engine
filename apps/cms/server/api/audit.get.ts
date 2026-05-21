import { auditLog, users } from '@blog-engine/db/schema'
import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')
  const db = useDb()

  const rows = await db
    .select({
      id: auditLog.id,
      userId: auditLog.userId,
      userName: users.name,
      userEmail: users.email,
      action: auditLog.action,
      entityType: auditLog.entityType,
      entityId: auditLog.entityId,
      diff: auditLog.diff,
      at: auditLog.at,
    })
    .from(auditLog)
    .leftJoin(users, eq(users.id, auditLog.userId))
    .orderBy(desc(auditLog.at))
    .limit(200)

  return { entries: rows }
})
