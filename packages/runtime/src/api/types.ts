import {
  SwatchFragment as Swatch,
  FileFragment as File,
  TypographyFragment as Typography,
  PagePathnameSliceFragment,
  GlobalElementFragment as GlobalElement,
  LocalizedGlobalElementFragment as LocalizedGlobalElement,
  TableFragment as Table,
  SnippetFragment as Snippet,
  PageFragment as Page,
  SiteFragment as Site,
} from './graphql/generated/types'

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

export type APIResourceLocale<R extends APIResource | APIResourceType> = R extends
  | LocalizableAPIResource
  | LocalizableAPIResourceType
  ? string | null
  : never
