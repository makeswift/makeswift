import { match } from 'ts-pattern'
import { type Document } from '../react-page'
import { type Element } from '@makeswift/controls'
import { EMBEDDED_DOCUMENT_TYPE } from '../modules/read-only-documents'

export function getRootElementFromDocument(document: Document): Element {
  return match(document)
    .with({ __type: EMBEDDED_DOCUMENT_TYPE }, doc => doc.rootElement ?? doc.initialRootElement)
    .otherwise(doc => doc.rootElement)
}
