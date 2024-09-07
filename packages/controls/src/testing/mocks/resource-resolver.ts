import {
  type FetchableValue,
  type ResourceResolver,
  type ValueSubscription,
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
      readStableValue: () => null,
      subscribe: () => () => {},
      fetch: () => Promise.resolve(null),
    }
  },

  resolveFile(_fileId: string): FetchableValue<File | null> {
    return {
      readStableValue: () => null,
      subscribe: () => () => {},
      fetch: () => Promise.resolve(null),
    }
  },

  resolveTypography(
    _typographyId: string | undefined,
  ): FetchableValue<Typography | null> {
    return {
      readStableValue: () => null,
      subscribe: () => () => {},
      fetch: () => Promise.resolve(null),
    }
  },

  resolvePagePathnameSlice(
    _pageId: string,
  ): FetchableValue<PagePathnameSlice | null> {
    return {
      readStableValue: () => null,
      subscribe: () => () => {},
      fetch: () => Promise.resolve(null),
    }
  },

  resolveElementId(_elementKey: string): ValueSubscription<string | null> {
    return {
      readStableValue: () => null,
      subscribe: () => () => {},
    }
  },
}
