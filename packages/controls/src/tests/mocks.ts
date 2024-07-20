import {
  type ResourceResolver,
  type ValueSubscription,
  type FetchableValue,
} from '../resource-resolver'

import {
  type Swatch,
  type File,
  type PagePathnameSlice,
} from '../resources/types'

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
