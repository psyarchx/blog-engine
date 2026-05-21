import {
  pgTable,
  text,
  timestamp,
  jsonb,
  pgEnum,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'
import { users } from './users'
import { media } from './media'
import { createId } from '../utils'
import type { PostContent, PostSeo } from '@blog-engine/shared'

export const postStatus = pgEnum('post_status', ['draft', 'scheduled', 'published'])

export const posts = pgTable(
  'posts',
  {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    excerpt: text('excerpt'),
    coverImageId: text('cover_image_id').references(() => media.id, { onDelete: 'set null' }),
    authorId: text('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),

    content: jsonb('content').$type<PostContent>().notNull(),
    contentHtml: text('content_html'),

    status: postStatus('status').notNull().default('draft'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }),

    tags: jsonb('tags').$type<string[]>().notNull().default([]),
    seo: jsonb('seo').$type<PostSeo>().notNull().default({}),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('posts_slug_unique').on(t.slug),
    index('posts_status_idx').on(t.status),
    index('posts_published_at_idx').on(t.publishedAt),
  ],
)

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
