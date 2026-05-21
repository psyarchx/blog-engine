import type { H3Event } from 'h3'
import type { Role } from '@blog-engine/auth'
import { hasRole, isRole } from '@blog-engine/auth'

export interface AuthSession {
  userId: string
  email: string
  name: string
  role: Role
  sessionId: string
}

export async function getAuthSession(event: H3Event): Promise<AuthSession | null> {
  const auth = useServerAuth()
  const result = await auth.api.getSession({ headers: event.headers })
  if (!result?.user || !result.session) return null

  const role = isRole(result.user.role) ? result.user.role : 'author'
  return {
    userId: result.user.id,
    email: result.user.email,
    name: result.user.name,
    role,
    sessionId: result.session.id,
  }
}

export async function requireAuthSession(event: H3Event): Promise<AuthSession> {
  const session = await getAuthSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return session
}

export async function requireRole(event: H3Event, role: Role): Promise<AuthSession> {
  const session = await requireAuthSession(event)
  if (!hasRole(session.role, role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  return session
}
