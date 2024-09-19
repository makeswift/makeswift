import * as APIResources from '../api-resources'
import * as Actions from '../../actions'
import {
  APIResourceType,
  type Swatch,
  type File,
  type Typography,
  type PagePathnameSlice,
  type GlobalElement,
  type LocalizedGlobalElement,
  type Table,
  type Snippet,
  type Page,
  type Site,
  type APIResource,
} from '../../../api'

const swatch: Swatch = {
  __typename: APIResourceType.Swatch,
  id: '[test-swatch-id]',
  hue: 100,
  saturation: 70,
  lightness: 90,
}

const file: File = {
  __typename: APIResourceType.File,
  id: '[test-file-id]',
  name: 'test-file-name',
  extension: 'png',
  publicUrl: 'https://example.com/test-file.png',
  dimensions: { width: 1024, height: 1024 },
}

const typography: Typography = {
  __typename: APIResourceType.Typography,
  id: '[test-typography-id]',
  name: 'test-typography-name',
  style: [],
}

const pagePathnameSlice: PagePathnameSlice = {
  __typename: APIResourceType.PagePathnameSlice,
  id: '[test-page-pathname-slice-id]',
  pathname: 'test/pathname',
}

const localizedPagePathnameSlice_fr_FR: PagePathnameSlice = {
  __typename: APIResourceType.PagePathnameSlice,
  id: '[test-page-pathname-slice-id]',
  pathname: 'test-pathname',
  basePageId: '[test-base-page-id]',
  localizedPathname: 'fr-FR/test/localized-pathname',
}

const localizedPagePathnameSlice_it_IT: PagePathnameSlice = {
  __typename: APIResourceType.PagePathnameSlice,
  id: '[test-page-pathname-slice-id]',
  pathname: 'test-pathname',
  basePageId: '[test-base-page-id]',
  localizedPathname: 'it-IT/test/localized-pathname',
}

const globalElement: GlobalElement = {
  __typename: APIResourceType.GlobalElement,
  id: '[test-global-element-id]',
  data: {},
}

const localizedGlobalElement_fr_FR: LocalizedGlobalElement = {
  __typename: APIResourceType.LocalizedGlobalElement,
  id: '[test-localized-global-element-id]',
  data: { prompt: 'bonjour le monde' },
}

const localizedGlobalElement_it_IT: LocalizedGlobalElement = {
  __typename: APIResourceType.LocalizedGlobalElement,
  id: '[test-localized-global-element-id]',
  data: { prompt: 'ciao mondo' },
}

const table: Table = {
  __typename: APIResourceType.Table,
  id: '[test-table-id]',
  name: 'test-table-name',
  columns: [],
}

const snippet: Snippet = {
  __typename: APIResourceType.Snippet,
  id: '[test-snippet-id]',
  name: 'test-snippet-name',
  code: 'test-snippet-code',
  cleanup: null,
  location: 'BODY',
  shouldAddToNewPages: false,
  liveEnabled: false,
  builderEnabled: false,
}

const page: Page = {
  __typename: APIResourceType.Page,
  id: '[test-page-id]',
  snippets: [],
}

const site: Site = {
  __typename: APIResourceType.Site,
  id: '[test-site-id]',
  googleFonts: {
    edges: [],
  },
}

describe('state / APIResources', () => {
  test('`getInitialState` w/o arguments returns an empty state', () => {
    const state = APIResources.getInitialState()
    const serializedState = APIResources.getSerializedState(state)
    expect(serializedState).toMatchSnapshot()
  })

  test('`getInitialState`/`getSerializedState` are symmetrical', () => {
    const serializedState = {
      Swatch: [{ id: swatch.id, value: swatch }],
      File: [{ id: file.id, value: file }],
      Typography: [{ id: typography.id, value: typography }],
      PagePathnameSlice: [
        { id: pagePathnameSlice.id, value: pagePathnameSlice },
        {
          id: localizedPagePathnameSlice_fr_FR.id,
          value: localizedPagePathnameSlice_fr_FR,
          locale: 'fr-FR',
        },
        {
          id: localizedPagePathnameSlice_it_IT.id,
          value: localizedPagePathnameSlice_it_IT,
          locale: 'it-IT',
        },
      ],
      GlobalElement: [{ id: globalElement.id, value: globalElement }],
      LocalizedGlobalElement: [
        {
          id: localizedGlobalElement_fr_FR.id,
          value: localizedGlobalElement_fr_FR,
          locale: 'fr-FR',
        },
        {
          id: localizedGlobalElement_it_IT.id,
          value: localizedGlobalElement_it_IT,
          locale: 'it-IT',
        },
      ],
      Table: [{ id: table.id, value: table }],
      Snippet: [{ id: snippet.id, value: snippet }],
      Page: [{ id: page.id, value: page }],
      Site: [{ id: site.id, value: site }],
    }

    const state = APIResources.getInitialState(serializedState)
    expect(APIResources.getSerializedState(state)).toStrictEqual(serializedState)
  })

  test('`Actions.apiResourceFulfilled` correctly populates the store', () => {
    const state = (
      [
        [swatch, null],
        [file, null],
        [typography, null],
        [pagePathnameSlice, null],
        [localizedPagePathnameSlice_fr_FR, 'fr-FR'],
        [globalElement, null],
        [localizedGlobalElement_fr_FR, 'fr-FR'],
        [localizedGlobalElement_it_IT, 'it-IT'],
        [table, null],
        [snippet, null],
        [page, null],
        [site, null],
      ] as [APIResource, string][]
    ).reduce(
      (state, [resource, locale]) =>
        APIResources.reducer(
          state,
          Actions.apiResourceFulfilled(resource.__typename, resource.id, resource, locale),
        ),
      APIResources.getInitialState(),
    )

    expect(APIResources.getSerializedState(state)).toMatchSnapshot()
  })

  test('`Actions.changeApiResource` correctly updates the store', () => {
    const state = (
      [
        [swatch, null],
        [pagePathnameSlice, null],
        [localizedPagePathnameSlice_fr_FR, 'fr-FR'],
        [localizedPagePathnameSlice_it_IT, 'it-IT'],
        [globalElement, null],
        [localizedGlobalElement_fr_FR, 'fr-FR'],
        [localizedGlobalElement_it_IT, 'it-IT'],
      ] as [APIResource, string][]
    ).reduce(
      (state, [resource, locale]) =>
        APIResources.reducer(
          state,
          Actions.apiResourceFulfilled(resource.__typename, resource.id, resource, locale),
        ),
      APIResources.getInitialState(),
    )

    const updatedState = (
      [
        [{ ...swatch, hue: 17 }, null],
        [{ ...pagePathnameSlice, pathname: 'test/new-pathname' }, null],
        [
          {
            ...localizedPagePathnameSlice_it_IT,
            pathname: 'test/new-pathname',
            localizedPathname: 'test/new-localized-pathname-it-IT',
          },
          'it-IT',
        ],
        [{ ...localizedGlobalElement_fr_FR, data: { prompt: 'hello world' } }, 'fr-FR'],
      ] as [APIResource, string][]
    ).reduce(
      (state, [resource, locale]) =>
        APIResources.reducer(state, Actions.changeApiResource(resource, locale)),
      state,
    )

    expect(APIResources.getSerializedState(updatedState)).toMatchSnapshot()
  })

  test('`Actions.evictApiResource` correctly removes the resource from the store', () => {
    const state = (
      [
        [swatch, null],
        [pagePathnameSlice, null],
        [localizedPagePathnameSlice_fr_FR, 'fr-FR'],
        [localizedPagePathnameSlice_it_IT, 'it-IT'],
        [globalElement, null],
        [localizedGlobalElement_fr_FR, 'fr-FR'],
        [localizedGlobalElement_it_IT, 'it-IT'],
      ] as [APIResource, string][]
    ).reduce(
      (state, [resource, locale]) =>
        APIResources.reducer(
          state,
          Actions.apiResourceFulfilled(resource.__typename, resource.id, resource, locale),
        ),
      APIResources.getInitialState(),
    )

    const updatedState = (
      [
        [`${APIResourceType.Swatch}:${swatch.id}`, null],
        [`${APIResourceType.PagePathnameSlice}:${localizedPagePathnameSlice_fr_FR.id}`, 'fr-FR'],
        [`${APIResourceType.LocalizedGlobalElement}:${localizedGlobalElement_it_IT.id}`, 'it-IT'],
      ] as [string, string][]
    ).reduce(
      (state, [id, locale]) => APIResources.reducer(state, Actions.evictApiResource(id, locale)),
      state,
    )

    expect(APIResources.getSerializedState(updatedState)).toMatchSnapshot()
  })

  describe('Only getters for localizable resources accept the locale argument', () => {
    const state = APIResources.getInitialState()
    describe.each([
      APIResourceType.Swatch,
      APIResourceType.File,
      APIResourceType.Typography,
      APIResourceType.GlobalElement,
      APIResourceType.Table,
      APIResourceType.Snippet,
      APIResourceType.Page,
      APIResourceType.Site,
    ])('getter for %s', resourceType => {
      test.each(['fr-FR', null, undefined])('fails to compile with locale %s', locale => {
        //@ts-expect-error
        expect(APIResources.getHasAPIResource(state, resourceType, '', locale)).toBe(false)
        //@ts-expect-error
        expect(APIResources.getAPIResource(state, resourceType, '', locale)).toBe(null)
      })

      test('compiles w/o the locale argument', () => {
        expect(APIResources.getHasAPIResource(state, resourceType, '')).toBe(false)
        expect(APIResources.getAPIResource(state, resourceType, '')).toBe(null)
      })
    })

    describe.each([APIResourceType.LocalizedGlobalElement, APIResourceType.PagePathnameSlice])(
      'getter for %s',
      resourceType => {
        test.each(['fr-FR', null, undefined])('compiles w/ locale %s', locale => {
          expect(APIResources.getHasAPIResource(state, resourceType, '', locale)).toBe(false)
          expect(APIResources.getAPIResource(state, resourceType, '', locale)).toBe(null)
        })
      },
    )
  })

  test('`Actions.updateAPIClientCache` fills in the state from cache w/o overriding existing resources', () => {
    const state = (
      [
        [swatch, null],
        [pagePathnameSlice, null],
        [localizedPagePathnameSlice_fr_FR, 'fr-FR'],
        [globalElement, null],
        [localizedGlobalElement_it_IT, 'it-IT'],
      ] as [APIResource, string][]
    ).reduce(
      (state, [resource, locale]) =>
        APIResources.reducer(
          state,
          Actions.apiResourceFulfilled(resource.__typename, resource.id, resource, locale),
        ),
      APIResources.getInitialState(),
    )

    const apiResources = {
      Swatch: [{ id: swatch.id, value: { ...swatch, hue: 17 } }],
      PagePathnameSlice: [
        {
          id: pagePathnameSlice.id,
          value: { ...pagePathnameSlice, pathname: 'test/new-pathname' },
        },
        {
          id: localizedPagePathnameSlice_fr_FR.id,
          value: {
            ...localizedPagePathnameSlice_fr_FR,
            localizedPathname: 'test/new-localized-pathname-fr-FR',
          },
          locale: 'fr-FR',
        },
        {
          id: localizedPagePathnameSlice_it_IT.id,
          value: localizedPagePathnameSlice_it_IT,
          locale: 'it-IT',
        },
      ],
      LocalizedGlobalElement: [
        {
          id: localizedGlobalElement_fr_FR.id,
          value: localizedGlobalElement_fr_FR,
          locale: 'fr-FR',
        },
        {
          id: localizedGlobalElement_it_IT.id,
          value: {
            ...localizedGlobalElement_it_IT,
            localizedPathname: 'test/new-localized-pathname-it-IT',
          },
          locale: 'it-IT',
        },
      ],
      Table: [{ id: table.id, value: table }],
      Snippet: [{ id: snippet.id, value: snippet }],
    }

    const updatedState = APIResources.reducer(
      state,
      Actions.updateAPIClientCache({ apiResources, localizedResourcesMap: {} }),
    )

    expect(APIResources.getSerializedState(updatedState)).toMatchSnapshot()
  })
})
