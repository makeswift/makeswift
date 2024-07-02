import { P, match } from 'ts-pattern'
import { Element } from './common'

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

class FileTarget implements IntrospectionTarget<string> {
  get type() {
    return 'file'
  }

  introspect(_data: unknown) {
    // FIXME
    return []
  }
}

class TypographyTarget implements IntrospectionTarget<string> {
  get type() {
    return 'typography'
  }

  introspect(_data: unknown) {
    // FIXME
    return []
  }
}

class TableTarget implements IntrospectionTarget<string> {
  get type() {
    return 'table'
  }

  introspect(_data: unknown) {
    // FIXME
    return []
  }
}

class PageTarget implements IntrospectionTarget<string> {
  get type() {
    return 'page'
  }

  introspect(_data: unknown) {
    // FIXME
    return []
  }
}

class ChildrenElementTarget implements IntrospectionTarget<Element> {
  get type() {
    return 'children-element'
  }

  introspect(_data: unknown) {
    // FIXME
    return []
  }
}

export const Targets = {
  Swatch: new SwatchTarget(),
  File: new FileTarget(),
  Typography: new TypographyTarget(),
  Table: new TableTarget(),
  Page: new PageTarget(),
  ChildrenElement: new ChildrenElementTarget(),
}
