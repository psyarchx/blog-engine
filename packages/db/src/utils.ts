import { randomUUID } from 'node:crypto'

/**
 * URL-safe id used as PK for most tables. UUIDv4 keeps schemas portable;
 * swap to nanoid/cuid later without touching consumers.
 */
export function createId(): string {
  return randomUUID()
}
