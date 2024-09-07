import { type ValueSubscription } from '../lib/value-subscription'

import {
  type File,
  type PagePathnameSlice,
  type Swatch,
  type Typography,
} from './types'

export type FetchableValue<T> = ValueSubscription<T> & {
  fetch(): Promise<T>
}

export interface ResourceResolver {
  resolveSwatch(swatchId: string | undefined): FetchableValue<Swatch | null>
  resolveFile(fileId: string | undefined): FetchableValue<File | null>
  resolveTypography(
    typographyId: string | undefined,
  ): FetchableValue<Typography | null>

  resolvePagePathnameSlice(
    pageId: string | undefined,
  ): FetchableValue<PagePathnameSlice | null>

  resolveElementId(elementKey: string): ValueSubscription<string | null>
}
