import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { users } from './users'
import { createId } from '../utils'

export const media = pgTable('media', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  url: text('url').notNull(),
  mime: text('mime').notNull(),
  width: integer('width'),
  height: integer('height'),
  sizeBytes: integer('size_bytes').notNull(),
  alt: text('alt'),
  uploadedBy: text('uploaded_by')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Media = typeof media.$inferSelect
export type NewMedia = typeof media.$inferInsert
