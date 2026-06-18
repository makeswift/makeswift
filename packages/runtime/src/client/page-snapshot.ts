import { type SnippetLocation } from '../api/graphql/generated/types'
import { type CacheData } from '../api/api-resources-client'

import { type Element, type Document } from '../state/read-only-state'

export type Snippet = {
  id: string
  code: string
  location: SnippetLocation
  liveEnabled: boolean
  builderEnabled: boolean
  cleanup: string | null
}

export type Font = { family: string; variants: string[] }

type Meta = {
  title?: string | null
  description?: string | null
  keywords?: string | null
  socialImage?: {
    id: string
    publicUrl: string
    mimetype: string
  } | null
  favicon?: {
    id: string
    publicUrl: string
    mimetype: string
  } | null
}

type Seo = {
  canonicalUrl?: string | null
  isIndexingBlocked?: boolean | null
}

type LocalizedPage = {
  id: string
  data: Element
  elementTreeId: string
  parentId: string | null
  meta: Omit<Meta, 'favicon'>
  seo: Seo
}

export type MakeswiftPageDocument = {
  id: string
  site: { id: string }
  data: Element
  snippets: Snippet[]
  fonts: Font[]
  meta: Meta
  seo: Seo
  localizedPages: LocalizedPage[]
  locale: string | null
}

export function pageToRootDocument(pageDocument: MakeswiftPageDocument): Document {
  const { locale, localizedPages, id, data } = pageDocument
  const localizedPage = localizedPages.find(({ parentId }) => parentId == null)
  return localizedPage
    ? { key: localizedPage.elementTreeId, rootElement: localizedPage.data, locale }
    : { key: id, rootElement: data, locale }
}

export type MakeswiftPageSnapshot = {
  document: MakeswiftPageDocument
  cacheData: CacheData
}
