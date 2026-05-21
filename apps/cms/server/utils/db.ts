import { getDb, type Database } from '@blog-engine/db/client'

let cached: Database | null = null

export function useDb(): Database {
  if (cached) return cached
  const config = useRuntimeConfig()
  if (!config.databaseUrl) throw new Error('DATABASE_URL is not set')
  cached = getDb(config.databaseUrl)
  return cached
}
