import { Swatch } from './common/resources'
import { ValueSubscription } from './traits'

export interface ResourceResolver {
  readSwatch(swatchId: string): Swatch | null
  fetchSwatch(swatchId: string): Promise<Swatch | null>
  subscribeSwatch(swatchId: string): ValueSubscription<Swatch | null>
}
