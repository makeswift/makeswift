import {
  SwatchFragment as Swatch,
  FileFragment as File,
  TypographyFragment as Typography,
  PagePathnameSliceFragment as PagePathnameSlice,
  GlobalElementFragment as GlobalElement,
  LocalizedGlobalElementFragment as LocalizedGlobalElement,
  TableFragment as Table,
  SnippetFragment as Snippet,
  PageFragment as Page,
  SiteFragment as Site,
} from './generated/types'

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

export type APIResource =
  | Swatch
  | File
  | Typography
  | PagePathnameSlice
  | GlobalElement
  | LocalizedGlobalElement
  | Table
  | Snippet
  | Page
  | Site

export const APIResourceType: { [R in APIResource as R['__typename']]: R['__typename'] } = {
  Swatch: 'Swatch',
  File: 'File',
  Typography: 'Typography',
  PagePathnameSlice: 'PagePathnameSlice',
  GlobalElement: 'GlobalElement',
  LocalizedGlobalElement: 'LocalizedGlobalElement',
  Table: 'Table',
  Snippet: 'Snippet',
  Page: 'Page',
  Site: 'Site',
}

export type APIResourceType = typeof APIResourceType[keyof typeof APIResourceType]
