import {
  pgTable,
  text,
  timestamp,
  jsonb,
  pgEnum,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'
import { createId } from '../utils'
import type { PageLayout, PageSeo } from '@blog-engine/shared'

export const pageType = pgEnum('page_type', [
  'static',
  'home',
  'blog_index',
  'post_template',
  'tag_template',
  'author_template',
])

export const pageStatus = pgEnum('page_status', ['draft', 'published'])

export const pages = pgTable(
  'pages',
  {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    type: pageType('type').notNull().default('static'),

    layout: jsonb('layout').$type<PageLayout>().notNull(),

    status: pageStatus('status').notNull().default('draft'),
    seo: jsonb('seo').$type<PageSeo>().notNull().default({}),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('pages_slug_unique').on(t.slug),
    index('pages_type_idx').on(t.type),
    index('pages_status_idx').on(t.status),
  ],
)

export type Page = typeof pages.$inferSelect
export type NewPage = typeof pages.$inferInsert
