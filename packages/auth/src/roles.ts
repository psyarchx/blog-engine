export const ROLES = ['admin', 'editor', 'author'] as const
export type Role = (typeof ROLES)[number]

const RANK: Record<Role, number> = { admin: 3, editor: 2, author: 1 }

export function hasRole(userRole: Role | null | undefined, required: Role): boolean {
  if (!userRole) return false
  return RANK[userRole] >= RANK[required]
}

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value)
}
