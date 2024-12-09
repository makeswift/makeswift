import { match } from 'ts-pattern'
import { type Document } from '../react-page'
import { type Element } from '@makeswift/controls'

export function getRootElementFromDocument(document: Document): Element {
  return match(document)
    .with({ __version: 1 }, doc => doc.rootElement ?? doc.initialRootElement)
    .otherwise(doc => doc.rootElement)
}
