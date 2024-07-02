import { Swatch } from './common/resources'

export type ValueSubscription<T> = {
  readValue(): T
  subscribe(onUpdate: () => void): () => void
}

export interface ResourceResolver {
  readSwatch(swatchId: string): Swatch | null
  fetchSwatch(swatchId: string): Promise<Swatch | null>
  subscribeSwatch(swatchId: string): ValueSubscription<Swatch | null>
}
