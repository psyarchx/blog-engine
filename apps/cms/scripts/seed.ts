import { eq } from 'drizzle-orm'
import { getDb, users, settings } from '@blog-engine/db'
import { createAuth } from '@blog-engine/auth/server'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('DATABASE_URL is required (see .env at the monorepo root)')
  process.exit(1)
}

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'admin1234'
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? 'Admin'

const db = getDb(databaseUrl)

await db
  .insert(settings)
  .values([
    { key: 'site.name', value: 'Blog Engine' },
    { key: 'site.activeTheme', value: 'modern' },
  ])
  .onConflictDoNothing()

const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, ADMIN_EMAIL))

if (existing) {
  console.log(`Admin already exists: ${ADMIN_EMAIL}`)
} else {
  const auth = createAuth({
    databaseUrl,
    secret: process.env.AUTH_SECRET ?? 'seed-only-secret',
    baseURL: 'http://localhost:3001',
  })

  const result = await auth.api.signUpEmail({
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: ADMIN_NAME },
  })
  if (!result?.user) {
    console.error('Failed to create admin user via better-auth')
    process.exit(1)
  }

  await db
    .update(users)
    .set({ role: 'admin', emailVerified: true })
    .where(eq(users.id, result.user.id))

  console.log('Seeded admin:')
  console.log(`  email:    ${ADMIN_EMAIL}`)
  console.log(`  password: ${ADMIN_PASSWORD}`)
}

console.log('Seed complete.')
process.exit(0)
