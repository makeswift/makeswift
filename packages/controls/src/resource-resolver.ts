import {
  type Swatch,
  type File,
  type PagePathnameSlice,
} from './resources/types'

export type ValueSubscription<T> = {
  readStableValue(previous?: T): T
  subscribe(onUpdate: () => void): () => void
}

export type FetchableValue<T> = ValueSubscription<T> & {
  fetch(): Promise<T>
}

export interface ResourceResolver {
  resolveSwatch(swatchId: string | undefined): FetchableValue<Swatch | null>

  resolveFile(fileId: string | undefined): FetchableValue<File | null>

  resolvePagePathnameSlice(
    pageId: string | undefined,
  ): FetchableValue<PagePathnameSlice | null>

  resolveElementId(elementKey: string): ValueSubscription<string | null>
}
