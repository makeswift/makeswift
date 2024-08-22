import { match, P } from 'ts-pattern'

import { Element } from './common'

type IntrospectionTargetType =
  | typeof SwatchTarget.Type
  | typeof FileTarget.Type
  | typeof TypographyTarget.Type
  | typeof TableTarget.Type
  | typeof PageTarget.Type
  | typeof ChildrenElementTarget.Type

export interface IntrospectionTarget<R = unknown> {
  get type(): IntrospectionTargetType
  introspect(data: unknown): R[]
}

class SwatchTarget implements IntrospectionTarget<string> {
  static readonly Type = 'swatch' as const

  get type() {
    return SwatchTarget.Type
  }

  introspect(data: unknown) {
    return match(data)
      .with({ swatchId: P.string }, ({ swatchId }) => [swatchId])
      .otherwise(() => [])
  }
}

class FileTarget implements IntrospectionTarget<string> {
  static readonly Type = 'file' as const

  get type() {
    return FileTarget.Type
  }

  introspect(_data: unknown) {
    return []
  }
}

class TypographyTarget implements IntrospectionTarget<string> {
  static readonly Type = 'typography' as const

  get type() {
    return TypographyTarget.Type
  }

  introspect(_data: unknown) {
    return []
  }
}

class TableTarget implements IntrospectionTarget<string> {
  static readonly Type = 'table' as const
  get type() {
    return TableTarget.Type
  }

  introspect(_data: unknown) {
    return []
  }
}

class PageTarget implements IntrospectionTarget<string> {
  static readonly Type = 'page' as const
  get type() {
    return PageTarget.Type
  }

  introspect(_data: unknown) {
    return []
  }
}

class ChildrenElementTarget implements IntrospectionTarget<Element> {
  static readonly Type = 'children-element' as const

  get type() {
    return ChildrenElementTarget.Type
  }

  introspect(_data: unknown) {
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
