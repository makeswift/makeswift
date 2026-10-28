import {
  SwatchFragment as Swatch,
  FileFragment as File,
  TypographyFragment as Typography,
  PagePathnameSliceFragment,
  GlobalElementFragment as GlobalElement,
  LocalizedGlobalElementFragment as LocalizedGlobalElement,
  TableFragment,
  SnippetFragment as Snippet,
  PageFragment as Page,
  SiteFragment as Site,
} from './graphql/generated/types'

// The REST `tables` endpoint returns each column's discriminator as `type` rather than the GraphQL
// `__typename`.
type WithColumnType<C> = C extends { __typename: infer T }
  ? Omit<C, '__typename'> & { type: T }
  : never

type Table = Omit<TableFragment, 'columns'> & {
  columns: Array<WithColumnType<TableFragment['columns'][number]>>
}

type PagePathnameSlice = PagePathnameSliceFragment & {
  basePageId?: string
  localizedPathname?: string | null
}

export type {
  Swatch,
  File,
  Typography,
  PagePathnameSlice,
  GlobalElement,
  LocalizedGlobalElement,
  Table,
  Snippet,
  Page,
  Site,
}

export type LocalizableAPIResource = PagePathnameSlice | LocalizedGlobalElement

export const LocalizableAPIResourceType: {
  [R in LocalizableAPIResource as R['__typename']]: R['__typename']
} = {
  PagePathnameSlice: 'PagePathnameSlice',
  LocalizedGlobalElement: 'LocalizedGlobalElement',
}

export type LocalizableAPIResourceType =
  (typeof LocalizableAPIResourceType)[keyof typeof LocalizableAPIResourceType]

export type APIResource =
  | LocalizableAPIResource
  | Swatch
  | File
  | Typography
  | GlobalElement
  | Table
  | Snippet
  | Page
  | Site

export const APIResourceType: { [R in APIResource as R['__typename']]: R['__typename'] } = {
  ...LocalizableAPIResourceType,
  Swatch: 'Swatch',
  File: 'File',
  Typography: 'Typography',
  GlobalElement: 'GlobalElement',
  Table: 'Table',
  Snippet: 'Snippet',
  Page: 'Page',
  Site: 'Site',
}

export type APIResourceType = (typeof APIResourceType)[keyof typeof APIResourceType]

export type APIResourceByType<T extends APIResourceType> = Extract<APIResource, { __typename: T }>

export type APIResourceLocale<R extends APIResource | APIResourceType> = R extends
  | LocalizableAPIResource
  | LocalizableAPIResourceType
  ? string | null
  : never

export type HttpFetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>
