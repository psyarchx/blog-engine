import { createBlogEngineAuthClient, type AuthClient } from '@blog-engine/auth/client'

let cached: AuthClient | null = null

export function useAuthClient(): AuthClient {
  if (cached) return cached
  const config = useRuntimeConfig()
  cached = createBlogEngineAuthClient({ baseURL: config.public.cmsOrigin })
  return cached
}
