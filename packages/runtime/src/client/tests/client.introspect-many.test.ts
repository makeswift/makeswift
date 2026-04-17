import { MakeswiftClient } from '../../client'
import { http, HttpResponse, graphql } from 'msw'
import { Table } from '@makeswift/prop-controllers'

import { createReactRuntime } from '../../runtimes/react/testing/react-runtime'

import { server } from '../../mocks/server'
import { TestWorkingSiteVersion } from '../../testing/fixtures'
import { Color, Image, Link, unstable_Typography } from '../../controls'
import { type Element } from '../../state/read-only-state'

const TEST_API_KEY = 'myApiKey'
const runtime = createReactRuntime()
const TEST_COMPONENT_TYPE = 'test-component'

runtime.registerComponent(() => null, {
  type: TEST_COMPONENT_TYPE,
  label: 'Test Component',
  props: {
    color: Color({ label: 'Color' }),
    file: Image({ label: 'Image' }),
    link: Link({ label: 'Link' }),
    // `unstable_Typography()` is the same introspection primitive `RichText` v1 uses
    // internally (see packages/controls/src/controls/rich-text/v1/introspection.ts),
    // so exercising it here covers the production path for Typography ID extraction.
    typography: unstable_Typography(),
    table: Table(),
  },
})

function createTestClient() {
  return new MakeswiftClient(TEST_API_KEY, { runtime })
}

function makeSwatch(id: string, hue = 0) {
  return { __typename: 'Swatch' as const, id, hue, saturation: 100, lightness: 50 }
}

function makeFile(id: string) {
  return {
    __typename: 'File' as const,
    id,
    name: `file-${id}`,
    extension: 'png',
    publicUrl: `https://example.com/${id}`,
    dimensions: { width: 100, height: 100 },
  }
}

function makeTable(id: string) {
  return { __typename: 'Table' as const, id, name: `table-${id}`, columns: [] }
}

function makeTypography(id: string, styleSwatchId: string | null = null) {
  return {
    __typename: 'Typography' as const,
    id,
    name: `typo-${id}`,
    style: [
      {
        deviceId: 'desktop',
        value: styleSwatchId != null ? { color: { swatchId: styleSwatchId, alpha: 1 } } : {},
      },
    ],
  }
}

function makePagePathnameSlice(pageId: string, pathname = `/${pageId}`) {
  return {
    __typename: 'PagePathnameSlice' as const,
    id: `slice-${pageId}`,
    basePageId: pageId,
    pathname,
  }
}

function componentTree(
  treeId: string,
  props: Record<string, unknown>,
): { id: string; data: Element } {
  return {
    id: treeId,
    data: { type: TEST_COMPONENT_TYPE, key: `${treeId}-key`, props } as Element,
  }
}

afterEach(() => {
  jest.restoreAllMocks()
})

describe('introspectMany', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  function setupGraphqlMock() {
    server.use(
      graphql.operation(() => {
        return HttpResponse.json({})
      }),
    )
  }

  test('fetches shared global elements only once across trees', async () => {
    // Arrange
    const client = createTestClient()
    setupGraphqlMock()

    const sharedGlobalElementId = 'global-elem-1'
    const globalElementData = {
      id: sharedGlobalElementId,
      data: { type: 'globalType', key: 'global-key-1', props: {} },
    }

    const globalElementHandler = jest.fn(() => {
      return HttpResponse.json(globalElementData, { status: 200 })
    })

    server.use(
      http.get(
        `${runtime.apiOrigin}/v3/global-elements/${sharedGlobalElementId}`,
        globalElementHandler,
      ),
    )

    const tree1 = {
      id: 'tree-1',
      data: { type: 'reference' as const, key: 'ref-1', value: sharedGlobalElementId },
    }
    const tree2 = {
      id: 'tree-2',
      data: { type: 'reference' as const, key: 'ref-2', value: sharedGlobalElementId },
    }

    // Act
    const results = await client['introspectMany']([tree1, tree2], TestWorkingSiteVersion, null)

    // Assert — global element should only be fetched once despite being referenced by two trees
    expect(globalElementHandler).toHaveBeenCalledTimes(1)

    // Both trees should have the global element in their CacheData
    expect(results.size).toBe(2)
    for (const result of results.values()) {
      const globalElements = result.apiResources.GlobalElement!
      expect(globalElements).toHaveLength(1)
      expect(globalElements[0].id).toBe(sharedGlobalElementId)
      expect(globalElements[0].value).toEqual(globalElementData)
    }
  })

  test('tracks global elements per-tree correctly when trees reference different global elements', async () => {
    // Arrange
    const client = createTestClient()
    setupGraphqlMock()

    const globalElement1 = {
      id: 'global-elem-1',
      data: { type: 'globalType1', key: 'global-key-1', props: {} },
    }
    const globalElement2 = {
      id: 'global-elem-2',
      data: { type: 'globalType2', key: 'global-key-2', props: {} },
    }

    server.use(
      http.get(`${runtime.apiOrigin}/v3/global-elements/global-elem-1`, () =>
        HttpResponse.json(globalElement1, { status: 200 }),
      ),
      http.get(`${runtime.apiOrigin}/v3/global-elements/global-elem-2`, () =>
        HttpResponse.json(globalElement2, { status: 200 }),
      ),
    )

    const tree1 = {
      id: 'tree-1',
      data: { type: 'reference' as const, key: 'ref-1', value: 'global-elem-1' },
    }
    const tree2 = {
      id: 'tree-2',
      data: { type: 'reference' as const, key: 'ref-2', value: 'global-elem-2' },
    }

    // Act
    const results = await client['introspectMany']([tree1, tree2], TestWorkingSiteVersion, null)

    // Assert — each tree only has its own global element
    expect(results.size).toBe(2)

    const tree1GlobalElements = results.get('tree-1')!.apiResources.GlobalElement!
    expect(tree1GlobalElements).toHaveLength(1)
    expect(tree1GlobalElements[0].id).toBe('global-elem-1')

    const tree2GlobalElements = results.get('tree-2')!.apiResources.GlobalElement!
    expect(tree2GlobalElements).toHaveLength(1)
    expect(tree2GlobalElements[0].id).toBe('global-elem-2')
  })

  test('handles element references to non-existent global elements gracefully', async () => {
    // Arrange
    const client = createTestClient()
    setupGraphqlMock()

    server.use(
      http.get(`${runtime.apiOrigin}/v3/global-elements/missing-elem`, () =>
        HttpResponse.text('', { status: 404 }),
      ),
    )

    const tree = {
      id: 'tree-1',
      data: { type: 'reference' as const, key: 'ref-1', value: 'missing-elem' },
    }

    // Act
    const results = await client['introspectMany']([tree], TestWorkingSiteVersion, null)

    // Assert
    expect(results.size).toBe(1)
    const globalElements = results.get('tree-1')!.apiResources.GlobalElement!
    expect(globalElements).toHaveLength(1)
    expect(globalElements[0].id).toBe('missing-elem')
    expect(globalElements[0].value).toBeNull()
  })

  test('extracts resources from inside global element data', async () => {
    // Arrange
    const client = createTestClient()

    const mockSwatch = { id: 'inner-swatch', hue: 200, saturation: 80, lightness: 60 }

    // Global element whose inner tree is a component with a Color prop
    const globalElement = {
      id: 'global-with-color',
      data: {
        type: TEST_COMPONENT_TYPE,
        key: 'inner-key',
        props: { color: { swatchId: 'inner-swatch', alpha: 0.8 } },
      },
    }

    server.use(
      http.get(`${runtime.apiOrigin}/v3/global-elements/global-with-color`, () =>
        HttpResponse.json(globalElement, { status: 200 }),
      ),
      http.get(`${runtime.apiOrigin}/v3/swatches/bulk`, ({ request }) => {
        const url = new URL(request.url)
        const ids = url.searchParams.getAll('ids')
        return HttpResponse.json(ids.map(id => (id === 'inner-swatch' ? mockSwatch : null)))
      }),
      graphql.operation(() => HttpResponse.json({})),
    )

    const tree = {
      id: 'tree-1',
      data: { type: 'reference' as const, key: 'ref-1', value: 'global-with-color' },
    }

    // Act
    const results = await client['introspectMany']([tree], TestWorkingSiteVersion, null)

    // Assert — swatch from inside the global element should be in CacheData
    expect(results.size).toBe(1)

    const swatches = results.get('tree-1')!.apiResources.Swatch!
    expect(swatches).toHaveLength(1)
    expect(swatches[0].id).toBe('inner-swatch')
    expect(swatches[0].value).toEqual(mockSwatch)

    const globalElements = results.get('tree-1')!.apiResources.GlobalElement!
    expect(globalElements).toHaveLength(1)
    expect(globalElements[0].id).toBe('global-with-color')
  })

  test('uses localized global element data and populates localizedResourcesMap', async () => {
    // Arrange
    const client = createTestClient()

    // Base global element has swatch-base
    const baseGlobalElement = {
      id: 'global-elem',
      data: {
        type: TEST_COMPONENT_TYPE,
        key: 'inner-key',
        props: { color: { swatchId: 'swatch-base', alpha: 1 } },
      },
    }

    // Localized variant has swatch-localized instead
    const localizedGlobalElement = {
      id: 'localized-global-elem-fr',
      data: {
        type: TEST_COMPONENT_TYPE,
        key: 'inner-key',
        props: { color: { swatchId: 'swatch-localized', alpha: 1 } },
      },
    }

    const mockSwatchLocalized = { id: 'swatch-localized', hue: 0, saturation: 100, lightness: 50 }

    server.use(
      http.get(`${runtime.apiOrigin}/v3/global-elements/global-elem`, () =>
        HttpResponse.json(baseGlobalElement, { status: 200 }),
      ),
      http.get(`${runtime.apiOrigin}/v3/localized-global-elements/global-elem`, () =>
        HttpResponse.json(localizedGlobalElement, { status: 200 }),
      ),
      http.get(`${runtime.apiOrigin}/v3/swatches/bulk`, ({ request }) => {
        const url = new URL(request.url)
        const ids = url.searchParams.getAll('ids')
        return HttpResponse.json(
          ids.map(id => (id === 'swatch-localized' ? mockSwatchLocalized : null)),
        )
      }),
      graphql.operation(() => HttpResponse.json({})),
    )

    const tree = {
      id: 'tree-1',
      data: { type: 'reference' as const, key: 'ref-1', value: 'global-elem' },
    }

    // Act
    const results = await client['introspectMany']([tree], TestWorkingSiteVersion, 'fr')

    // Assert
    expect(results.size).toBe(1)
    const tree1Result = results.get('tree-1')!

    // Should use localized data — swatch-localized, not swatch-base
    const swatches = tree1Result.apiResources.Swatch!
    expect(swatches).toHaveLength(1)
    expect(swatches[0].id).toBe('swatch-localized')
    expect(swatches[0].value).toEqual(mockSwatchLocalized)

    // LocalizedGlobalElement should be in CacheData
    const localizedGlobals = tree1Result.apiResources.LocalizedGlobalElement!
    expect(localizedGlobals).toHaveLength(1)
    expect(localizedGlobals[0].id).toBe('localized-global-elem-fr')
    expect(localizedGlobals[0].locale).toBe('fr')

    // localizedResourcesMap should map global element ID → localized ID
    expect(tree1Result.localizedResourcesMap).toEqual({
      fr: { 'global-elem': 'localized-global-elem-fr' },
    })
  })

  describe('per-tree isolation + deduplication: Swatch', () => {
    test('extracts swatches per-tree when trees reference distinct IDs', async () => {
      const client = createTestClient()
      const swatchA = makeSwatch('swatch-a')
      const swatchB = makeSwatch('swatch-b')

      server.use(
        http.get(`${runtime.apiOrigin}/v3/swatches/bulk`, ({ request }) => {
          const ids = new URL(request.url).searchParams.getAll('ids')
          return HttpResponse.json(
            ids.map(id => ({ 'swatch-a': swatchA, 'swatch-b': swatchB })[id] ?? null),
          )
        }),
        graphql.operation(() => HttpResponse.json({})),
      )

      const tree1 = componentTree('tree-1', { color: { swatchId: 'swatch-a', alpha: 1 } })
      const tree2 = componentTree('tree-2', { color: { swatchId: 'swatch-b', alpha: 1 } })

      const results = await client['introspectMany']([tree1, tree2], TestWorkingSiteVersion, null)

      expect(results.get('tree-1')!.apiResources.Swatch).toEqual([
        { id: 'swatch-a', value: swatchA },
      ])
      expect(results.get('tree-2')!.apiResources.Swatch).toEqual([
        { id: 'swatch-b', value: swatchB },
      ])
    })

    test('deduplicates a shared swatch ID across trees in a single bulk request', async () => {
      const client = createTestClient()
      const sharedSwatch = makeSwatch('shared')
      const handler = jest.fn(({ request }: { request: Request }) => {
        const ids = new URL(request.url).searchParams.getAll('ids')
        return HttpResponse.json(ids.map(() => sharedSwatch))
      })

      server.use(
        http.get(`${runtime.apiOrigin}/v3/swatches/bulk`, handler),
        graphql.operation(() => HttpResponse.json({})),
      )

      const tree1 = componentTree('tree-1', { color: { swatchId: 'shared', alpha: 1 } })
      const tree2 = componentTree('tree-2', { color: { swatchId: 'shared', alpha: 0.5 } })

      const results = await client['introspectMany']([tree1, tree2], TestWorkingSiteVersion, null)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(new URL(handler.mock.calls[0]![0].request.url).searchParams.getAll('ids')).toEqual([
        'shared',
      ])
      expect(results.get('tree-1')!.apiResources.Swatch).toEqual([
        { id: 'shared', value: sharedSwatch },
      ])
      expect(results.get('tree-2')!.apiResources.Swatch).toEqual([
        { id: 'shared', value: sharedSwatch },
      ])
    })
  })

  describe('per-tree isolation + deduplication: File', () => {
    test('extracts files per-tree when trees reference distinct IDs', async () => {
      const client = createTestClient()
      const fileA = makeFile('file-a')
      const fileB = makeFile('file-b')

      server.use(
        http.post(`${runtime.apiOrigin}/graphql`, async ({ request }) => {
          const body = (await request.clone().json()) as {
            variables: { fileIds?: string[]; tableIds?: string[] }
          }
          const fileIds = body.variables.fileIds ?? []
          return HttpResponse.json({
            data: {
              files: fileIds.map(id => ({ 'file-a': fileA, 'file-b': fileB })[id] ?? null),
              tables: (body.variables.tableIds ?? []).map(() => null),
            },
          })
        }),
      )

      const tree1 = componentTree('tree-1', { file: 'file-a' })
      const tree2 = componentTree('tree-2', { file: 'file-b' })

      const results = await client['introspectMany']([tree1, tree2], TestWorkingSiteVersion, null)

      expect(results.get('tree-1')!.apiResources.File).toEqual([{ id: 'file-a', value: fileA }])
      expect(results.get('tree-2')!.apiResources.File).toEqual([{ id: 'file-b', value: fileB }])
    })

    test('deduplicates a shared file ID across trees in a single GraphQL request', async () => {
      const client = createTestClient()
      const sharedFile = makeFile('shared')
      const requestedFileIds: string[][] = []

      server.use(
        http.post(`${runtime.apiOrigin}/graphql`, async ({ request }) => {
          const body = (await request.clone().json()) as {
            variables: { fileIds?: string[]; tableIds?: string[] }
          }
          const fileIds = body.variables.fileIds ?? []
          requestedFileIds.push(fileIds)
          return HttpResponse.json({
            data: {
              files: fileIds.map(id => (id === 'shared' ? sharedFile : null)),
              tables: (body.variables.tableIds ?? []).map(() => null),
            },
          })
        }),
      )

      const tree1 = componentTree('tree-1', { file: 'shared' })
      const tree2 = componentTree('tree-2', { file: 'shared' })

      const results = await client['introspectMany']([tree1, tree2], TestWorkingSiteVersion, null)

      expect(requestedFileIds).toEqual([['shared']])
      expect(results.get('tree-1')!.apiResources.File).toEqual([
        { id: 'shared', value: sharedFile },
      ])
      expect(results.get('tree-2')!.apiResources.File).toEqual([
        { id: 'shared', value: sharedFile },
      ])
    })
  })

  describe('per-tree isolation + deduplication: Typography', () => {
    function typographyPropData(id: string) {
      return { id, style: [{ deviceId: 'desktop', value: {} }] }
    }

    test('extracts typographies per-tree when trees reference distinct IDs', async () => {
      const client = createTestClient()
      const typoA = makeTypography('typo-a')
      const typoB = makeTypography('typo-b')

      server.use(
        http.get(`${runtime.apiOrigin}/v3/typographies/bulk`, ({ request }) => {
          const ids = new URL(request.url).searchParams.getAll('ids')
          return HttpResponse.json(
            ids.map(id => ({ 'typo-a': typoA, 'typo-b': typoB })[id] ?? null),
          )
        }),
        graphql.operation(() => HttpResponse.json({})),
      )

      const tree1 = componentTree('tree-1', { typography: typographyPropData('typo-a') })
      const tree2 = componentTree('tree-2', { typography: typographyPropData('typo-b') })

      const results = await client['introspectMany']([tree1, tree2], TestWorkingSiteVersion, null)

      expect(results.get('tree-1')!.apiResources.Typography).toEqual([
        { id: 'typo-a', value: typoA },
      ])
      expect(results.get('tree-2')!.apiResources.Typography).toEqual([
        { id: 'typo-b', value: typoB },
      ])
    })

    test('deduplicates a shared typography ID across trees in a single bulk request', async () => {
      const client = createTestClient()
      const sharedTypo = makeTypography('shared')
      const handler = jest.fn(({ request }: { request: Request }) => {
        const ids = new URL(request.url).searchParams.getAll('ids')
        return HttpResponse.json(ids.map(id => (id === 'shared' ? sharedTypo : null)))
      })

      server.use(
        http.get(`${runtime.apiOrigin}/v3/typographies/bulk`, handler),
        graphql.operation(() => HttpResponse.json({})),
      )

      const tree1 = componentTree('tree-1', { typography: typographyPropData('shared') })
      const tree2 = componentTree('tree-2', { typography: typographyPropData('shared') })

      const results = await client['introspectMany']([tree1, tree2], TestWorkingSiteVersion, null)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(new URL(handler.mock.calls[0]![0].request.url).searchParams.getAll('ids')).toEqual([
        'shared',
      ])
      expect(results.get('tree-1')!.apiResources.Typography).toEqual([
        { id: 'shared', value: sharedTypo },
      ])
      expect(results.get('tree-2')!.apiResources.Typography).toEqual([
        { id: 'shared', value: sharedTypo },
      ])
    })
  })

  describe('per-tree isolation + deduplication: Table', () => {
    test('extracts tables per-tree when trees reference distinct IDs', async () => {
      const client = createTestClient()
      const tableA = makeTable('table-a')
      const tableB = makeTable('table-b')

      server.use(
        http.post(`${runtime.apiOrigin}/graphql`, async ({ request }) => {
          const body = (await request.clone().json()) as {
            variables: { fileIds?: string[]; tableIds?: string[] }
          }
          const tableIds = body.variables.tableIds ?? []
          return HttpResponse.json({
            data: {
              files: (body.variables.fileIds ?? []).map(() => null),
              tables: tableIds.map(id => ({ 'table-a': tableA, 'table-b': tableB })[id] ?? null),
            },
          })
        }),
      )

      const tree1 = componentTree('tree-1', { table: 'table-a' })
      const tree2 = componentTree('tree-2', { table: 'table-b' })

      const results = await client['introspectMany']([tree1, tree2], TestWorkingSiteVersion, null)

      expect(results.get('tree-1')!.apiResources.Table).toEqual([{ id: 'table-a', value: tableA }])
      expect(results.get('tree-2')!.apiResources.Table).toEqual([{ id: 'table-b', value: tableB }])
    })

    test('deduplicates a shared table ID across trees in a single GraphQL request', async () => {
      const client = createTestClient()
      const sharedTable = makeTable('shared')
      const requestedTableIds: string[][] = []

      server.use(
        http.post(`${runtime.apiOrigin}/graphql`, async ({ request }) => {
          const body = (await request.clone().json()) as {
            variables: { fileIds?: string[]; tableIds?: string[] }
          }
          const tableIds = body.variables.tableIds ?? []
          requestedTableIds.push(tableIds)
          return HttpResponse.json({
            data: {
              files: (body.variables.fileIds ?? []).map(() => null),
              tables: tableIds.map(id => (id === 'shared' ? sharedTable : null)),
            },
          })
        }),
      )

      const tree1 = componentTree('tree-1', { table: 'shared' })
      const tree2 = componentTree('tree-2', { table: 'shared' })

      const results = await client['introspectMany']([tree1, tree2], TestWorkingSiteVersion, null)

      expect(requestedTableIds).toEqual([['shared']])
      expect(results.get('tree-1')!.apiResources.Table).toEqual([
        { id: 'shared', value: sharedTable },
      ])
      expect(results.get('tree-2')!.apiResources.Table).toEqual([
        { id: 'shared', value: sharedTable },
      ])
    })
  })

  describe('per-tree isolation + deduplication: PagePathnameSlice', () => {
    // The /v3/page-pathname-slices/bulk response is normalized client-side: the
    // returned slice's `id` is rewritten to its `basePageId`, and `localizedPathname`
    // defaults to `null`. Expected cacheData values reflect that normalization.
    function pageLinkProp(pageId: string) {
      return { type: 'OPEN_PAGE', payload: { pageId, openInNewTab: false } }
    }
    function expectedSliceValue(pageId: string) {
      return {
        __typename: 'PagePathnameSlice',
        id: pageId,
        basePageId: pageId,
        pathname: `/${pageId}`,
        localizedPathname: null,
      }
    }

    test('extracts page slices per-tree when trees reference distinct IDs', async () => {
      const client = createTestClient()

      server.use(
        http.get(`${runtime.apiOrigin}/v3/page-pathname-slices/bulk`, ({ request }) => {
          const ids = new URL(request.url).searchParams.getAll('ids')
          return HttpResponse.json(ids.map(id => makePagePathnameSlice(id)))
        }),
        graphql.operation(() => HttpResponse.json({})),
      )

      const tree1 = componentTree('tree-1', { link: pageLinkProp('page-a') })
      const tree2 = componentTree('tree-2', { link: pageLinkProp('page-b') })

      const results = await client['introspectMany']([tree1, tree2], TestWorkingSiteVersion, null)

      expect(results.get('tree-1')!.apiResources.PagePathnameSlice).toEqual([
        { id: 'page-a', value: expectedSliceValue('page-a'), locale: null },
      ])
      expect(results.get('tree-2')!.apiResources.PagePathnameSlice).toEqual([
        { id: 'page-b', value: expectedSliceValue('page-b'), locale: null },
      ])
    })

    test('deduplicates a shared page ID across trees in a single bulk request', async () => {
      const client = createTestClient()
      const handler = jest.fn(({ request }: { request: Request }) => {
        const ids = new URL(request.url).searchParams.getAll('ids')
        return HttpResponse.json(ids.map(id => makePagePathnameSlice(id)))
      })

      server.use(
        http.get(`${runtime.apiOrigin}/v3/page-pathname-slices/bulk`, handler),
        graphql.operation(() => HttpResponse.json({})),
      )

      const tree1 = componentTree('tree-1', { link: pageLinkProp('shared') })
      const tree2 = componentTree('tree-2', { link: pageLinkProp('shared') })

      const results = await client['introspectMany']([tree1, tree2], TestWorkingSiteVersion, null)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(new URL(handler.mock.calls[0]![0].request.url).searchParams.getAll('ids')).toEqual([
        'shared',
      ])
      expect(results.get('tree-1')!.apiResources.PagePathnameSlice).toEqual([
        { id: 'shared', value: expectedSliceValue('shared'), locale: null },
      ])
      expect(results.get('tree-2')!.apiResources.PagePathnameSlice).toEqual([
        { id: 'shared', value: expectedSliceValue('shared'), locale: null },
      ])
    })
  })

  describe('typography-derived swatch discovery', () => {
    test("a typography's style swatch is fetched and stays scoped to trees that reference that typography", async () => {
      const client = createTestClient()

      // typo-1 has a style swatch 'typo-swatch'; 'direct-swatch' is only in tree-direct.
      const typo1 = makeTypography('typo-1', 'typo-swatch')

      server.use(
        http.get(`${runtime.apiOrigin}/v3/typographies/bulk`, ({ request }) => {
          const ids = new URL(request.url).searchParams.getAll('ids')
          return HttpResponse.json(ids.map(id => (id === 'typo-1' ? typo1 : null)))
        }),
        http.get(`${runtime.apiOrigin}/v3/swatches/bulk`, ({ request }) => {
          const ids = new URL(request.url).searchParams.getAll('ids')
          return HttpResponse.json(ids.map(id => makeSwatch(id)))
        }),
        graphql.operation(() => HttpResponse.json({})),
      )

      const treeWithTypo = componentTree('tree-typo', {
        typography: { id: 'typo-1', style: [{ deviceId: 'desktop', value: {} }] },
      })
      const treeWithDirectSwatch = componentTree('tree-direct', {
        color: { swatchId: 'direct-swatch', alpha: 1 },
      })

      const results = await client['introspectMany'](
        [treeWithTypo, treeWithDirectSwatch],
        TestWorkingSiteVersion,
        null,
      )

      // Typography-derived swatch is attached to the referencing tree...
      expect(
        results
          .get('tree-typo')!
          .apiResources.Swatch!.map(r => r.id)
          .sort(),
      ).toEqual(['typo-swatch'])

      // ...and does NOT leak to the tree that doesn't reference the typography.
      expect(
        results
          .get('tree-direct')!
          .apiResources.Swatch!.map(r => r.id)
          .sort(),
      ).toEqual(['direct-swatch'])
    })
  })

  describe('cross-resource contamination', () => {
    test("each tree's cacheData contains only the resource types it actually references", async () => {
      const client = createTestClient()

      server.use(
        http.get(`${runtime.apiOrigin}/v3/swatches/bulk`, ({ request }) => {
          const ids = new URL(request.url).searchParams.getAll('ids')
          return HttpResponse.json(ids.map(id => makeSwatch(id)))
        }),
        http.get(`${runtime.apiOrigin}/v3/typographies/bulk`, ({ request }) => {
          const ids = new URL(request.url).searchParams.getAll('ids')
          return HttpResponse.json(ids.map(id => makeTypography(id)))
        }),
        http.get(`${runtime.apiOrigin}/v3/page-pathname-slices/bulk`, ({ request }) => {
          const ids = new URL(request.url).searchParams.getAll('ids')
          return HttpResponse.json(ids.map(id => makePagePathnameSlice(id)))
        }),
        http.post(`${runtime.apiOrigin}/graphql`, async ({ request }) => {
          const body = (await request.clone().json()) as {
            variables: { fileIds?: string[]; tableIds?: string[] }
          }
          const fileIds = body.variables.fileIds ?? []
          const tableIds = body.variables.tableIds ?? []
          return HttpResponse.json({
            data: {
              files: fileIds.map(id => makeFile(id)),
              tables: tableIds.map(id => makeTable(id)),
            },
          })
        }),
      )

      // tree-a references Swatch/File/Typography/PagePathnameSlice. No Table.
      const treeA = componentTree('tree-a', {
        color: { swatchId: 'swatch-a', alpha: 1 },
        file: 'file-a',
        typography: { id: 'typo-a', style: [{ deviceId: 'desktop', value: {} }] },
        link: { type: 'OPEN_PAGE', payload: { pageId: 'page-a', openInNewTab: false } },
      })
      // tree-b references only Table.
      const treeB = componentTree('tree-b', { table: 'table-b' })

      const results = await client['introspectMany']([treeA, treeB], TestWorkingSiteVersion, null)

      const a = results.get('tree-a')!.apiResources
      expect(a.Swatch!.map(r => r.id)).toEqual(['swatch-a'])
      expect(a.File!.map(r => r.id)).toEqual(['file-a'])
      expect(a.Typography!.map(r => r.id)).toEqual(['typo-a'])
      expect(a.PagePathnameSlice!.map(r => r.id)).toEqual(['page-a'])
      expect(a.Table).toEqual([])

      const b = results.get('tree-b')!.apiResources
      expect(b.Table!.map(r => r.id)).toEqual(['table-b'])
      expect(b.Swatch).toEqual([])
      expect(b.File).toEqual([])
      expect(b.Typography).toEqual([])
      expect(b.PagePathnameSlice).toEqual([])
    })
  })

  describe('localized global element edge cases', () => {
    test("records null in localizedResourcesMap when localized variant doesn't exist", async () => {
      const client = createTestClient()

      const baseGlobalElement = {
        id: 'global-1',
        data: {
          type: TEST_COMPONENT_TYPE,
          key: 'inner',
          props: { color: { swatchId: 'swatch-base', alpha: 1 } },
        },
      }

      server.use(
        http.get(`${runtime.apiOrigin}/v3/global-elements/global-1`, () =>
          HttpResponse.json(baseGlobalElement, { status: 200 }),
        ),
        // Localized variant doesn't exist
        http.get(`${runtime.apiOrigin}/v3/localized-global-elements/global-1`, () =>
          HttpResponse.text('', { status: 404 }),
        ),
        http.get(`${runtime.apiOrigin}/v3/swatches/bulk`, ({ request }) => {
          const ids = new URL(request.url).searchParams.getAll('ids')
          return HttpResponse.json(ids.map(id => makeSwatch(id)))
        }),
        graphql.operation(() => HttpResponse.json({})),
      )

      const tree = {
        id: 'tree-1',
        data: { type: 'reference' as const, key: 'ref', value: 'global-1' },
      }

      const results = await client['introspectMany']([tree], TestWorkingSiteVersion, 'fr')

      // null signals to the client that no localized variant exists, preventing
      // repeated 404 fetches (one per referencing element on the page).
      expect(results.get('tree-1')!.localizedResourcesMap).toEqual({
        fr: { 'global-1': null },
      })
      // Base global element's inner swatch still flows into cacheData.
      expect(results.get('tree-1')!.apiResources.Swatch!.map(r => r.id)).toEqual(['swatch-base'])
    })

    test('fetches a shared localized global element only once across trees', async () => {
      const client = createTestClient()

      const baseGlobalElement = {
        id: 'global-1',
        data: { type: TEST_COMPONENT_TYPE, key: 'inner', props: {} },
      }
      const localizedGlobalElement = {
        id: 'localized-global-1-fr',
        data: { type: TEST_COMPONENT_TYPE, key: 'inner', props: {} },
      }

      const localizedHandler = jest.fn(() =>
        HttpResponse.json(localizedGlobalElement, { status: 200 }),
      )

      server.use(
        http.get(`${runtime.apiOrigin}/v3/global-elements/global-1`, () =>
          HttpResponse.json(baseGlobalElement, { status: 200 }),
        ),
        http.get(`${runtime.apiOrigin}/v3/localized-global-elements/global-1`, localizedHandler),
        graphql.operation(() => HttpResponse.json({})),
      )

      const tree1 = {
        id: 'tree-1',
        data: { type: 'reference' as const, key: 'r1', value: 'global-1' },
      }
      const tree2 = {
        id: 'tree-2',
        data: { type: 'reference' as const, key: 'r2', value: 'global-1' },
      }

      const results = await client['introspectMany']([tree1, tree2], TestWorkingSiteVersion, 'fr')

      expect(localizedHandler).toHaveBeenCalledTimes(1)
      for (const treeId of ['tree-1', 'tree-2']) {
        const r = results.get(treeId)!
        expect(r.apiResources.LocalizedGlobalElement!.map(le => le.id)).toEqual([
          'localized-global-1-fr',
        ])
        expect(r.localizedResourcesMap).toEqual({
          fr: { 'global-1': 'localized-global-1-fr' },
        })
      }
    })

    test('skips all localized-variant fetches when locale is null and leaves localizedResourcesMap empty', async () => {
      const client = createTestClient()

      const baseGlobalElement = {
        id: 'global-1',
        data: { type: TEST_COMPONENT_TYPE, key: 'inner', props: {} },
      }

      const localizedHandler = jest.fn(() => HttpResponse.json({}, { status: 200 }))

      server.use(
        http.get(`${runtime.apiOrigin}/v3/global-elements/global-1`, () =>
          HttpResponse.json(baseGlobalElement, { status: 200 }),
        ),
        http.get(`${runtime.apiOrigin}/v3/localized-global-elements/global-1`, localizedHandler),
        graphql.operation(() => HttpResponse.json({})),
      )

      const tree = {
        id: 'tree-1',
        data: { type: 'reference' as const, key: 'r', value: 'global-1' },
      }

      const results = await client['introspectMany']([tree], TestWorkingSiteVersion, null)

      expect(localizedHandler).not.toHaveBeenCalled()
      expect(results.get('tree-1')!.localizedResourcesMap).toEqual({})
    })
  })
})
