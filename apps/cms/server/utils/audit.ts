import { auditLog } from '@blog-engine/db/schema'

export interface LogAuditInput {
  userId: string | null
  action: string
  entityType: string
  entityId?: string
  diff?: unknown
}

export async function logAudit(input: LogAuditInput): Promise<void> {
  const db = useDb()
  await db.insert(auditLog).values({
    userId: input.userId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId ?? null,
    diff: (input.diff ?? null) as never,
  })
}
