import { createAuthClient } from 'better-auth/vue'

export interface CreateAuthClientOptions {
  baseURL: string
}

export function createBlogEngineAuthClient(opts: CreateAuthClientOptions) {
  return createAuthClient({
    baseURL: opts.baseURL,
  })
}

export type AuthClient = ReturnType<typeof createBlogEngineAuthClient>
