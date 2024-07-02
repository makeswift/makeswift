import {
  type ResourceResolver,
  type ValueSubscription,
} from '../resource-resolver'
import { type Swatch } from '../common/resources'

export const noOpResourceResolver: ResourceResolver = {
  resolveSwatch(_swatchId: string): ValueSubscription<Swatch | null> {
    return {
      readStableValue: () => null,
      subscribe: () => () => {},
    }
  },
}
