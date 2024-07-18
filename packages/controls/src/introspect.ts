import { P, match } from 'ts-pattern'
import { Element } from './common'

export const IntrospectionTargetType = {
  Swatch: 'swatch',
  File: 'file',
  Typography: 'typography',
  Table: 'table',
  Page: 'page',
  ChildrenElement: 'children-element',
} as const

type IntrospectionTargetType =
  (typeof IntrospectionTargetType)[keyof typeof IntrospectionTargetType]

export interface IntrospectionTarget<R = unknown> {
  get type(): IntrospectionTargetType
  introspect(data: unknown): R[]
}

class SwatchTarget implements IntrospectionTarget<string> {
  get type() {
    return IntrospectionTargetType.Swatch
  }

  introspect(data: unknown) {
    return match(data)
      .with({ swatchId: P.string }, ({ swatchId }) => [swatchId])
      .otherwise(() => [])
  }
}

class FileTarget implements IntrospectionTarget<string> {
  get type() {
    return IntrospectionTargetType.File
  }

  introspect(_data: unknown) {
    // FIXME
    return []
  }
}

class TypographyTarget implements IntrospectionTarget<string> {
  get type() {
    return IntrospectionTargetType.Typography
  }

  introspect(_data: unknown) {
    // FIXME
    return []
  }
}

class TableTarget implements IntrospectionTarget<string> {
  get type() {
    return IntrospectionTargetType.Table
  }

  introspect(_data: unknown) {
    // FIXME
    return []
  }
}

class PageTarget implements IntrospectionTarget<string> {
  get type() {
    return IntrospectionTargetType.Page
  }

  introspect(_data: unknown) {
    // FIXME
    return []
  }
}

class ChildrenElementTarget implements IntrospectionTarget<Element> {
  get type() {
    return IntrospectionTargetType.ChildrenElement
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
