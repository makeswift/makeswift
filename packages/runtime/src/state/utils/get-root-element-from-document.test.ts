import { getRootElementFromDocument } from './get-root-element-from-document'
import { Document } from '../react-page'

describe('getRootElementFromDocument', () => {
  test('returns rootElement for base documents', () => {
    const document: Document = {
      key: 'document-key',
      locale: null,
      rootElement: {
        key: 'root-element',
        type: 'DIV',
        props: {},
      },
    }

    const root = getRootElementFromDocument(document)
    expect(root).toMatchObject({
      key: 'root-element',
      type: 'DIV',
      props: {},
    })
  })

  test('returns root element if defined for embedded document', () => {
    const document: Document = {
      id: 'document-id',
      key: 'document-key',
      type: 'DOCUMENT',
      name: 'Document',
      locale: null,
      initialRootElement: {
        key: 'initial-root-element',
        type: 'DIV',
        props: {},
      },
      rootElement: {
        key: 'root-element',
        type: 'DIV',
        props: {},
      },
      __type: 'EMBEDDED_DOCUMENT',
    }

    const root = getRootElementFromDocument(document)
    expect(root).toMatchObject({
      key: 'root-element',
      type: 'DIV',
      props: {},
    })
  })

  test('returns initial root element if root element is null', () => {
    const document: Document = {
      id: 'document-id',
      key: 'document-key',
      type: 'DOCUMENT',
      name: 'Document',
      locale: null,
      initialRootElement: {
        key: 'initial-root-element',
        type: 'DIV',
        props: {},
      },
      rootElement: null,
      __type: 'EMBEDDED_DOCUMENT',
    }

    const root = getRootElementFromDocument(document)
    expect(root).toMatchObject({
      key: 'initial-root-element',
      type: 'DIV',
      props: {},
    })
  })
})
