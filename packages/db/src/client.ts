import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

let cached: ReturnType<typeof createClient> | null = null

function createClient(databaseUrl: string) {
  const queryClient = postgres(databaseUrl, { max: 10 })
  return drizzle(queryClient, { schema, casing: 'snake_case' })
}

export function getDb(databaseUrl?: string) {
  if (cached) return cached
  const url = databaseUrl ?? process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  cached = createClient(url)
  return cached
}

export type Database = ReturnType<typeof getDb>
