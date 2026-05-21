import { createAuth, type ServerAuth } from '@blog-engine/auth/server'

let cached: ServerAuth | null = null

export function useServerAuth(): ServerAuth {
  if (cached) return cached
  const config = useRuntimeConfig()

  if (!config.databaseUrl) throw new Error('DATABASE_URL is not set')
  if (!config.authSecret) throw new Error('AUTH_SECRET is not set')

  cached = createAuth({
    databaseUrl: config.databaseUrl,
    secret: config.authSecret,
    baseURL: config.public.cmsOrigin,
    trustedOrigins: [config.public.webOrigin],
  })
  return cached
}
