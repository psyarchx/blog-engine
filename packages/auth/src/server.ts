import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { getDb } from '@blog-engine/db/client'
import * as schema from '@blog-engine/db/schema'

export interface CreateAuthOptions {
  databaseUrl: string
  secret: string
  baseURL: string
  trustedOrigins?: string[]
  /** Called when better-auth needs to send a verification email. */
  sendVerificationEmail?: (input: { to: string; url: string }) => Promise<void> | void
}

export type ServerAuth = ReturnType<typeof createAuth>

export function createAuth(opts: CreateAuthOptions) {
  const db = getDb(opts.databaseUrl)

  const options = {
    secret: opts.secret,
    baseURL: opts.baseURL,
    trustedOrigins: opts.trustedOrigins,
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: {
        users: schema.users,
        sessions: schema.sessions,
        accounts: schema.accounts,
        verifications: schema.verifications,
      },
      usePlural: true,
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      autoSignIn: true,
      minPasswordLength: 8,
    },
    user: {
      additionalFields: {
        role: { type: 'string', defaultValue: 'author', input: false },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: true, maxAge: 60 * 5 },
    },
    advanced: {
      cookiePrefix: 'blog-engine',
    },
  } satisfies BetterAuthOptions

  return betterAuth(options)
}
