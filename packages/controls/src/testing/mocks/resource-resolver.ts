import { type ValueSubscription } from '../../lib/value-subscription'

import {
  type FetchableValue,
  type ResourceResolver,
} from '../../resources/resolver'
import {
  type File,
  type PagePathnameSlice,
  type Swatch,
  type Typography,
} from '../../resources/types'

export const noOpResourceResolver: ResourceResolver = {
  resolveSwatch(_swatchId: string): FetchableValue<Swatch | null> {
    return {
      name: 'swatch-no-op',
      readStable: () => null,
      subscribe: () => () => {},
      fetch: () => Promise.resolve(null),
    }
  },

  resolveFile(_fileId: string): FetchableValue<File | null> {
    return {
      name: 'file-no-op',
      readStable: () => null,
      subscribe: () => () => {},
      fetch: () => Promise.resolve(null),
    }
  },

  resolveTypography(
    _typographyId: string | undefined,
  ): FetchableValue<Typography | null> {
    return {
      name: 'typography-no-op',
      readStable: () => null,
      subscribe: () => () => {},
      fetch: () => Promise.resolve(null),
    }
  },

  resolvePagePathnameSlice(
    _pageId: string,
  ): FetchableValue<PagePathnameSlice | null> {
    return {
      name: 'page-pathname-no-op',
      readStable: () => null,
      subscribe: () => () => {},
      fetch: () => Promise.resolve(null),
    }
  },

  resolveElementId(_elementKey: string): ValueSubscription<string | null> {
    return {
      name: 'element-id-no-op',
      readStable: () => null,
      subscribe: () => () => {},
    }
  },
}
