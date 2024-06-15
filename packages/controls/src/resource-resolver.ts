import { Swatch } from './common/resources'

export interface ResolvableValue<T> {
  readValue(): T
  subscribe(onUpdate: () => void): () => void
  map<U>(fn: (value: T) => U): ResolvableValue<U>
}

export class ResolvedConstant<T> implements ResolvableValue<T> {
  constructor(private readonly value: T) {}

  readValue() {
    return this.value
  }

  subscribe() {
    return () => {}
  }

  map<U>(fn: (value: T) => U): ResolvableValue<U> {
    return new ResolvedConstant(fn(this.value))
  }
}

export function resolved<T>(value: T): ResolvableValue<T> {
  return new ResolvedConstant(value)
}

export interface ResourceResolver {
  resolveSwatch(swatchId: string): ResolvableValue<Swatch | null>
}
