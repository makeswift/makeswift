import { BlockType, InlineType } from '../../slate'

export const ObjectType = {
  Value: 'value',
  Text: 'text',
  Inline: 'inline',
  Block: 'block',
  Document: 'document',
  Leaf: 'leaf',
  Selection: 'selection',
  Mark: 'mark',
  Range: 'range',
  Decoration: 'decoration',
  Annotation: 'annotation',
  Point: 'point',
  Operation: 'operation',
} as const

export type ObjectType = typeof ObjectType[keyof typeof ObjectType]

export interface ValueJSON {
  object?: typeof ObjectType.Value | undefined
  document?: DocumentJSON | undefined
  selection?: SelectionJSON | undefined
  annotations?: { [key: string]: AnnotationJSON } | undefined
  data?: { [key: string]: any } | undefined
}
export type RichTextDTO = ValueJSON

export interface DocumentJSON {
  object?: typeof ObjectType.Document | undefined
  nodes?: NodeJSON[] | undefined
  key?: string | undefined
  data?: { [key: string]: any } | undefined
}

export interface BlockJSON {
  object?: typeof ObjectType.Block | undefined
  type: typeof BlockType[keyof typeof BlockType]
  key?: string | undefined
  nodes?: Array<BlockJSON | InlineJSON | TextJSON> | undefined
  data?: { [key: string]: any } | undefined
}

export interface InlineJSON {
  object?: typeof ObjectType.Inline | undefined
  type: typeof InlineType[keyof typeof InlineType]
  key?: string | undefined
  nodes?: Array<InlineJSON | TextJSON> | undefined
  data?: { [key: string]: any } | undefined
}

export interface TextJSON {
  object?: typeof ObjectType.Text | undefined
  key?: string | undefined
  text?: string | undefined
  marks?: MarkJSON[] | undefined
}

export interface LeafJSON {
  object?: typeof ObjectType.Leaf | undefined
  marks?: MarkJSON[] | undefined
  text?: string | undefined
}
export type NodeJSON = DocumentJSON | BlockJSON | InlineJSON | TextJSON

export interface SelectionJSON {
  object?: typeof ObjectType.Selection | undefined
  anchor?: PointJSON | undefined
  focus?: PointJSON | undefined
  isFocused?: boolean | undefined
  marks?: MarkJSON[] | undefined
}

export interface MarkJSON {
  object?: typeof ObjectType.Mark | undefined
  type: string
  data?: { [key: string]: any } | undefined
}

export interface RangeJSON {
  object?: typeof ObjectType.Range | undefined
  anchor?: PointJSON | undefined
  focus?: PointJSON | undefined
}

export interface DecorationJSON {
  object?: typeof ObjectType.Decoration | undefined
  anchor?: PointJSON | undefined
  focus?: PointJSON | undefined
  type?: string | undefined
  data?: { [key: string]: any } | undefined
}

export interface AnnotationJSON {
  object?: typeof ObjectType.Annotation | undefined
  key: string
  type: string
  data?: { [key: string]: any } | undefined
  anchor?: PointJSON | undefined
  focus?: PointJSON | undefined
}

export interface PointJSON {
  object?: typeof ObjectType.Point | undefined
  key?: string | undefined
  offset?: number | undefined
  path?: number[] | undefined
}

export interface OperationJSON {
  object?: typeof ObjectType.Operation | undefined
  type: string
  text?: string | undefined
  target?: number | undefined
  properties?: NodeJSON | ValueJSON | SelectionJSON | AnnotationJSON | undefined
  position?: number | undefined
  path?: number[] | undefined
  offset?: number | undefined
  node?: Node | undefined
  newProperties?: NodeJSON | ValueJSON | SelectionJSON | MarkJSON | AnnotationJSON | undefined
  newPath?: number[] | undefined
  mark?: MarkJSON | undefined
  data?: { [key: string]: any } | undefined
  annotation?: AnnotationJSON | undefined
}
