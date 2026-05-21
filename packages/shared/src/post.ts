/**
 * Tiptap-compatible document. Kept loose so the editor stays free to evolve.
 * Concrete validation happens in the editor package via Zod.
 */
export interface PostContent {
  type: 'doc'
  content?: unknown[]
}

export interface PostSeo {
  title?: string
  description?: string
  ogImageUrl?: string
  canonicalUrl?: string
  noindex?: boolean
}
