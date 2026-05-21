import { pgTable, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core'
import { users } from './users'
import { createId } from '../utils'

export const auditLog = pgTable(
  'audit_log',
  {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id'),
    diff: jsonb('diff'),
    at: timestamp('at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('audit_user_idx').on(t.userId),
    index('audit_entity_idx').on(t.entityType, t.entityId),
  ],
)

export type AuditEntry = typeof auditLog.$inferSelect
