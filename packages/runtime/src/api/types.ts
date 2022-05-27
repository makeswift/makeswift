import {
  SwatchFragment as Swatch,
  FileFragment as File,
  TypographyFragment as Typography,
  PagePathnameSliceFragment as PagePathnameSlice,
  GlobalElementFragment as GlobalElement,
  TableFragment as Table,
  SnippetFragment as Snippet,
  PageFragment as Page,
  SiteFragment as Site,
} from './generated/graphql'

export type APIResource =
  | Swatch
  | File
  | Typography
  | PagePathnameSlice
  | GlobalElement
  | Table
  | Snippet
  | Page
  | Site

export type APIResourceType = APIResource['__typename']
