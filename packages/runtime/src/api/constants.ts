import type { DocumentNode } from 'graphql'

import {
  SwatchFragmentDoc,
  FileFragmentDoc,
  TypographyFragmentDoc,
  PagePathnameSliceFragmentDoc,
  GlobalElementFragmentDoc,
  TableFragmentDoc,
  SnippetFragmentDoc,
  PageFragmentDoc,
  SiteFragmentDoc,
} from './generated/graphql'
import type { APIResourceType } from './types'

export const Fragments: Record<APIResourceType, DocumentNode> = {
  Swatch: SwatchFragmentDoc,
  File: FileFragmentDoc,
  Typography: TypographyFragmentDoc,
  PagePathnameSlice: PagePathnameSliceFragmentDoc,
  GlobalElement: GlobalElementFragmentDoc,
  Table: TableFragmentDoc,
  Snippet: SnippetFragmentDoc,
  Page: PageFragmentDoc,
  Site: SiteFragmentDoc,
}
