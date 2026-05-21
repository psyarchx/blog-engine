import { pgTable, text, timestamp, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core'
import { createId } from '../utils'

export const userRole = pgEnum('user_role', ['admin', 'editor', 'author'])

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    email: text('email').notNull(),
    name: text('name').notNull(),
    avatarUrl: text('avatar_url'),
    role: userRole('role').notNull().default('author'),
    passwordHash: text('password_hash'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('users_email_unique').on(t.email)],
)

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const invites = pgTable(
  'invites',
  {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    email: text('email').notNull(),
    role: userRole('role').notNull().default('author'),
    token: text('token').notNull(),
    invitedBy: text('invited_by')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('invites_token_unique').on(t.token)],
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect
export type Invite = typeof invites.$inferSelect
