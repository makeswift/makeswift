import type { DocumentNode } from 'graphql'

import {
  SwatchFragmentDoc,
  FileFragmentDoc,
  TypographyFragmentDoc,
  PagePathnameSliceFragmentDoc,
} from './generated/graphql'
import type { APIResourceType } from './types'

export const Fragments: Record<APIResourceType, DocumentNode> = {
  Swatch: SwatchFragmentDoc,
  File: FileFragmentDoc,
  Typography: TypographyFragmentDoc,
  PagePathnameSlice: PagePathnameSliceFragmentDoc,
}
