import {
  type ResourceResolver,
  type ValueSubscription,
} from '../resource-resolver'
import { type Swatch, type File } from '../common/resources'

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
}
