import { z } from 'zod'

import { type CacheData } from '../api/api-resources-client'

import { EMBEDDED_DOCUMENT_TYPE, type EmbeddedDocument } from '../state/modules/read-only-documents'

import { deterministicUUID } from '../utils/deterministic-uuid'

import * as Schema from './schema/component-document'

export type MakeswiftComponentDocument = z.infer<typeof Schema.componentDocument>
export type MakeswiftComponentDocumentFallback = z.infer<typeof Schema.componentDocumentFallback>

export type MakeswiftComponentMetadata = {
  allowLocaleFallback: boolean
  requestedLocale: string | null
}

export function componentDocumentToRootEmbeddedDocument({
  document,
  documentKey,
  name,
  type,
  description,
  meta,
}: {
  document: MakeswiftComponentDocument | MakeswiftComponentDocumentFallback
  documentKey: string
  name: string
  type: string
  description?: string
  meta: MakeswiftComponentMetadata
}): EmbeddedDocument {
  const { data: rootElement, locale, id } = document

  if (rootElement != null && rootElement.type !== type) {
    throw new Error(
      `Type "${rootElement.type}" does not match the expected type "${type}" from the snapshot`,
    )
  }

  const rootDocument: EmbeddedDocument = {
    key: documentKey,
    rootElement: rootElement ?? {
      // Fallback rootElement
      // Create a stable uuid so two different clients will have the same empty element data.
      // This is needed to make presence feature work for an element that is not yet created.
      key: deterministicUUID({ id, locale, seed: documentKey }),
      type,
      props: {},
    },
    locale,
    id,
    type,
    name,
    meta: { ...meta, description },
    __type: EMBEDDED_DOCUMENT_TYPE,
  }

  return rootDocument
}

export type MakeswiftComponentSnapshot = {
  document: MakeswiftComponentDocument | MakeswiftComponentDocumentFallback
  key: string
  cacheData: CacheData
  meta: MakeswiftComponentMetadata
}
