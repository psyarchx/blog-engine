export interface ResponsiveSpan {
  default: number
  md?: number
  lg?: number
}

export type BlockPropValue =
  | string
  | number
  | boolean
  | null
  | BlockBinding
  | BlockPropValue[]
  | { [key: string]: BlockPropValue }

/**
 * Bind a block prop to a field from the page context (e.g. {{post.title}}).
 * The renderer resolves these at request time.
 */
export interface BlockBinding {
  $bind: string
}

export interface PageBlock {
  id: string
  component: string
  version: number
  span: ResponsiveSpan
  order: number
  props: Record<string, BlockPropValue>
}

export interface PageSectionSettings {
  background?: 'default' | 'muted' | 'inverse'
  padding?: 'compact' | 'normal' | 'spacious'
  maxWidth?: 'narrow' | 'default' | 'wide' | 'full'
}

export interface PageSection {
  id: string
  order: number
  settings: PageSectionSettings
  blocks: PageBlock[]
}

export interface PageLayout {
  version: 1
  sections: PageSection[]
}

export interface PageSeo {
  title?: string
  description?: string
  ogImageUrl?: string
  noindex?: boolean
}

export function emptyLayout(): PageLayout {
  return { version: 1, sections: [] }
}
