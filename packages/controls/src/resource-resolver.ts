import { type Swatch, type File } from './common/resources'

export type ValueSubscription<T> = {
  readStableValue(previous?: T): T
  subscribe(onUpdate: () => void): () => void
}

export interface ResourceResolver {
  resolveSwatch(swatchId: string | undefined): ValueSubscription<Swatch | null>
  resolveFile(fileId: string | undefined): ValueSubscription<File | null>
}
