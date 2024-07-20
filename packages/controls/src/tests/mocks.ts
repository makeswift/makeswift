import {
  type ResourceResolver,
  type ValueSubscription,
} from '../resource-resolver'
import {
  type Swatch,
  type File,
  type PagePathnameSlice,
} from '../common/resources'

export const noOpResourceResolver: ResourceResolver = {
  resolveSwatch(_swatchId: string): ValueSubscription<Swatch | null> {
    return {
      readStableValue: () => null,
      subscribe: () => () => {},
    }
  },

  resolveFile(_fileId: string): ValueSubscription<File | null> {
    return {
      readStableValue: () => null,
      subscribe: () => () => {},
    }
  },

  resolvePagePathnameSlice(
    _pageId: string,
  ): ValueSubscription<PagePathnameSlice | null> {
    return {
      readStableValue: () => null,
      subscribe: () => () => {},
    }
  },

  resolveElementId(_elementKey: string): ValueSubscription<string | null> {
    return {
      readStableValue: () => null,
      subscribe: () => () => {},
    }
  },
}
