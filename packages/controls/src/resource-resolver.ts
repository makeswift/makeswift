import { type Swatch } from './common/resources'

export type ValueSubscription<T> = {
  readStableValue(previous?: T): T
  subscribe(onUpdate: () => void): () => void
}

export interface ResourceResolver {
  resolveSwatch(swatchId: string | undefined): ValueSubscription<Swatch | null>
}
