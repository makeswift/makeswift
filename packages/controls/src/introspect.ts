import { P, match } from 'ts-pattern'

export interface IntrospectionTarget<R = unknown> {
  get type(): string
  introspect(data: unknown): R[]
}

class SwatchTarget implements IntrospectionTarget<string> {
  get type() {
    return 'swatch'
  }

  introspect(data: unknown) {
    return match(data)
      .with({ swatchId: P.string }, ({ swatchId }) => [swatchId])
      .otherwise(() => [])
  }
}

export const Targets = {
  Swatch: new SwatchTarget(),
}
