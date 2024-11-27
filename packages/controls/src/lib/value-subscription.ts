export type ValueSubscription<T> = {
  name: string
  readStable(): T
  subscribe(onUpdate: () => void): () => void
}
