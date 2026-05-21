import { getDb } from './client'
import { users, settings } from './schema'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

const db = getDb(databaseUrl)

await db
  .insert(users)
  .values({
    email: 'admin@example.com',
    name: 'Admin',
    role: 'admin',
  })
  .onConflictDoNothing()

await db
  .insert(settings)
  .values([
    { key: 'site.name', value: 'Blog Engine' },
    { key: 'site.activeTheme', value: 'modern' },
  ])
  .onConflictDoNothing()

console.log('Seed complete.')
process.exit(0)
