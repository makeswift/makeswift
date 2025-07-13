/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { render } from '@testing-library/react'
import { ReactRuntime } from '../../../react'
import * as Testing from '../../../runtimes/react/testing'
import { type MakeswiftPageSnapshot, type MakeswiftPageDocument } from '../../client'
import { type CacheData } from '../../../api/react'
import { Page as MakeswiftPage } from '../page'
import { ComponentPropsWithoutRef } from 'react'

const NoOpComponentType = 'NoOpComponent'
function NoOpComponent() {
  return <></>
}

const pageDocumentFixture = {
  id: '2222-2222-2222-2222',
  site: {
    id: '1111-1111-1111-1111',
  },
  data: {
    type: NoOpComponentType,
    key: '0000-0000-0000-0000',
    props: {},
  },
  snippets: [],
  fonts: [],
  localizedPages: [],
  locale: null,
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
    canonicalUrl: 'https://example.com/user-specified-canonical-url-path',
    isIndexingBlocked: true,
  },
  href: 'https://example.com/test-page-path',
}

function createMakeswiftPageSnapshot(
  document: MakeswiftPageDocument,
  cacheData: CacheData = {
    apiResources: {},
    localizedResourcesMap: {},
  },
): MakeswiftPageSnapshot {
  return {
    document,
    cacheData,
  }
}

async function testMakeswiftPageMetadataRendering(
  props: ComponentPropsWithoutRef<typeof MakeswiftPage>,
) {
  const runtime = new ReactRuntime()

  runtime.registerComponent(NoOpComponent, {
    type: NoOpComponentType,
    label: 'NoOp Component',
    props: {},
  })

  return await act(async () =>
    render(
      <Testing.ReactProvider runtime={runtime} previewMode={false}>
        <MakeswiftPage {...props} />
      </Testing.ReactProvider>,
      {
        container: document.body.appendChild(document.createElement('head')),
      },
    ),
  )
}

function getPageMetaTags(
  container: HTMLElement,
): { name: string; content: string }[] {
  const metaTags = container.getElementsByTagName('meta')
  return Array.from(metaTags).filter(({ name }) => name !== 'makeswift-draft-info')
}

describe('MakeswiftPage', () => {
  describe('metadata and seo tag rendering', () => {
    test('renders all metadata by default (without passing prop)', async () => {
      const snapshot = createMakeswiftPageSnapshot(pageDocumentFixture)

      const render = await testMakeswiftPageMetadataRendering({ snapshot })
      expect(render.container).toMatchSnapshot()
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

      const render = await testMakeswiftPageMetadataRendering({ snapshot, metadata })
      expect(render.container).toMatchSnapshot()
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

      const render = await testMakeswiftPageMetadataRendering({ snapshot, metadata })
      expect(render.container).toMatchSnapshot()
      expect(getPageMetaTags(render.container).length).toBe(0)
      expect(render.container.getElementsByTagName('link').length).toBe(0)
    })

    test('only renders selective metadata when passing options', async () => {
      const snapshot = createMakeswiftPageSnapshot(pageDocumentFixture)

      // Only render title, description, and keywords
      const render = await testMakeswiftPageMetadataRendering({
        snapshot,
        metadata: {
          title: true,
          description: true,
          keywords: true,
        },
      })
      expect(render.container).toMatchSnapshot()
    })

    test('renders a self-referencing canonical tag when metadata.canonicalUrl is true but no user-specified canonical url was provided', async () => {
      const pageDocument = {
        ...pageDocumentFixture,
        seo: {
          ...pageDocumentFixture.seo,
          canonicalUrl: null,
        }
      }
      const snapshot = createMakeswiftPageSnapshot(pageDocument)
      const render = await testMakeswiftPageMetadataRendering({ snapshot, metadata: true })
      expect(render.container).toMatchSnapshot()
    })
  })
})
