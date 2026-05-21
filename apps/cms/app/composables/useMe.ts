import type { Role } from '@blog-engine/auth'

export interface MeUser {
  id: string
  email: string
  name: string
  role: Role
}

export interface MeResponse {
  user: MeUser | null
}

/** Fetches the currently-logged-in user, deduped via useFetch. */
export async function useMe() {
  return useFetch<MeResponse>('/api/me', {
    key: 'auth-me',
    credentials: 'include',
    default: () => ({ user: null }),
  })
}
