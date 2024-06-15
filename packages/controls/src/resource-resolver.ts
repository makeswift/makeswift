import { Swatch } from './common/resources'

export interface ResourceResolver {
  fetchSwatch(swatchId: string): Promise<Swatch | null>
}
