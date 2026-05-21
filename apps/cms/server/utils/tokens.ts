import { randomBytes } from 'node:crypto'

/** URL-safe random token (no padding). 32 bytes ~= 43 chars. */
export function createUrlToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url')
}
