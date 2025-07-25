import { randomUUID } from 'crypto'
import { type MakeswiftPageSnapshot, type MakeswiftComponentSnapshot } from '../../../client'
import { type ElementData } from '../../../state/react-page'
import { CacheData } from '../../../api/react'
import { MakeswiftComponentType } from '../../../components'

export function createRootComponent(elements: ElementData[], rootId?: string) {
  return {
    key: rootId ?? randomUUID(),
    type: MakeswiftComponentType.Root,
    props: {
      children: {
        columns: [
          {
            deviceId: 'desktop',
            value: {
              count: 12,
              spans: elements?.map(() => [12]),
            },
          },
        ],
        elements,
      },
    },
  }
}

export function createMakeswiftPageSnapshot(
  elementData: ElementData,
  {
    cacheData = {},
    locale = null,
  }: { cacheData?: Partial<MakeswiftPageSnapshot['cacheData']>; locale?: string | null } = {},
): MakeswiftPageSnapshot {
  return {
    document: {
      id: 'test-page-id',
      site: { id: 'test-site-id' },
      data: elementData,
      snippets: [],
      fonts: [],
      meta: {},
      seo: {},
      localizedPages: [],
      locale,
    },
    cacheData: {
      ...CacheData.empty(),
      ...cacheData,
    },
  }
}

export function createMakeswiftComponentSnapshot(
  elementData: ElementData,
  {
    cacheData = {},
    locale = null,
  }: { cacheData?: Partial<MakeswiftComponentSnapshot['cacheData']>; locale?: string | null } = {},
): MakeswiftComponentSnapshot {
  return {
    key: randomUUID(),
    document: {
      id: 'test-component-id',
      name: 'Test Component Document',
      siteId: 'test-site-id',
      data: elementData,
      inheritsFromParent: false,
      locale,
    },
    meta: {
      allowLocaleFallback: false,
      requestedLocale: locale,
    },
    cacheData: {
      ...CacheData.empty(),
      ...cacheData,
    },
  }
}
