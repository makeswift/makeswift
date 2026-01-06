/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { type MakeswiftPageDocument } from '../../../client'

import { createMakeswiftPageSnapshot, testMakeswiftPageHeadRendering } from '../../testing'

import { pageDocument } from './__fixtures__/page-document'

const pageDocumentFixture: MakeswiftPageDocument = {
  ...pageDocument,
  meta: {
    title: 'Test Title',
    description: 'Test Description',
    keywords: 'test, keywords',
    socialImage: {
      id: '0000-0000-0000-0001',
      publicUrl: 'https://example.com/image.jpg',
      mimetype: 'image/jpeg',
    },
    favicon: {
      id: '0000-0000-0000-0002',
      publicUrl: 'https://example.com/favicon.ico',
      mimetype: 'image/x-icon',
    },
  },
  seo: {
    canonicalUrl: 'https://example.com',
    isIndexingBlocked: true,
  },
}

function getPageMetaTags(container: HTMLElement): { name: string; content: string }[] {
  const metaTags = container.getElementsByTagName('meta')
  return Array.from(metaTags).filter(({ name }) => name !== 'makeswift-preview-info')
}

describe('MakeswiftPage', () => {
  describe('metadata and seo tag rendering', () => {
    test('renders all metadata by default (without passing prop)', async () => {
      const snapshot = createMakeswiftPageSnapshot(pageDocumentFixture)

      await testMakeswiftPageHeadRendering({ snapshot })
      // React 19 hoists metadata elements to document.head
      expect(document.head).toMatchSnapshot()
    })

    test.each([
      { label: true, metadata: true },
      {
        label: 'all options as true',
        metadata: {
          title: true,
          description: true,
          keywords: true,
          socialImage: true,
          favicon: true,
          canonicalUrl: true,
          indexingBlocked: true,
        },
      },
    ])(`renders all metadata when passing $label`, async ({ metadata }) => {
      const snapshot = createMakeswiftPageSnapshot(pageDocumentFixture)

      await testMakeswiftPageHeadRendering({ snapshot, metadata })
      // React 19 hoists metadata elements to document.head
      expect(document.head).toMatchSnapshot()
    })

    test.each([
      { label: false, metadata: false },
      {
        label: 'empty options',
        metadata: {},
      },
      {
        label: 'all options as false',
        metadata: {
          title: false,
          description: false,
          keywords: false,
          socialImage: false,
          favicon: false,
          canonicalUrl: false,
          indexingBlocked: false,
        },
      },
    ])(`does NOT render any page metadata when passing $label`, async ({ metadata }) => {
      const snapshot = createMakeswiftPageSnapshot(pageDocumentFixture)

      await testMakeswiftPageHeadRendering({ snapshot, metadata })
      // React 19 hoists metadata elements to document.head
      expect(document.head).toMatchSnapshot()
      expect(getPageMetaTags(document.head).length).toBe(0)
      expect(document.head.getElementsByTagName('link').length).toBe(0)
    })

    test('only renders selective metadata when passing options', async () => {
      const snapshot = createMakeswiftPageSnapshot(pageDocumentFixture)

      // Only render title, description, and keywords
      await testMakeswiftPageHeadRendering({
        snapshot,
        metadata: {
          title: true,
          description: true,
          keywords: true,
        },
      })
      // React 19 hoists metadata elements to document.head
      expect(document.head).toMatchSnapshot()
    })
  })
})
