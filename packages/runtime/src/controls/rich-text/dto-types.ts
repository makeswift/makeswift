import { BlockType, InlineType } from './types'

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

interface ValueJSON {
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

export const OperationDTOType = {
  InsertText: 'insert_text',
  RemoveText: 'remove_text',
  AddMark: 'add_mark',
  RemoveMark: 'remove_mark',
  SetMark: 'set_mark',
  AddAnnotation: 'add_annotation',
  RemoveAnnotation: 'remove_annotation',
  SetAnnotation: 'set_annotation',
  InsertNode: 'insert_node',
  MergeNode: 'merge_node',
  RemoveNode: 'remove_node',
  SetNode: 'set_node',
  SplitNod: 'split_node',
  SetSelection: 'set_selection',
  SplitNode: 'split_node',
  SetValue: 'set_value',
} as const

type InsertTextOperation = {
  type: typeof OperationDTOType.InsertText
  path: number[]
  offset: number
  text: string
  data: any
}

type RemoveTextOperation = {
  type: typeof OperationDTOType.RemoveText
  path: number[]
  offset: number
  text: string
  data: any
}

type AddMarkOperation = {
  type: typeof OperationDTOType.AddMark
  path: number[]
  mark: MarkJSON
  data: any
}

type RemoveMarkOperation = {
  type: typeof OperationDTOType.RemoveMark
  path: number[]
  mark: MarkJSON
  data: any
}

//todojosh
type SetMarkOperation = {
  type: 'set_mark'
  path: number[]
  properties: MarkJSON
  newProperties: MarkJSON
  data: any
}

type AddAnnotationOperation = {
  type: 'add_annotation'
  annotation: AnnotationJSON
  data: any
}

type RemoveAnnotationOperation = {
  type: 'remove_annotation'
  annotation: AnnotationJSON
  data: any
}

type SetAnnotationOperation = {
  type: 'set_annotation'
  properties: AnnotationJSON
  newProperties: AnnotationJSON
  data: any
}

type InsertNodeOperation = {
  type: 'insert_node'
  path: number[]
  node: Node
  data: any
}

type MergeNodeOperation = {
  type: 'merge_node'
  path: number[]
  position: number
  properties: NodeJSON
  data: any
}

type MoveNodeOperation = {
  type: 'move_node'
  path: number[]
  newPath: number[]
  data: any
}

type RemoveNodeOperation = {
  type: 'remove_node'
  path: number[]
  node: Node
  data: any
}

type SetNodeOperation = {
  type: 'set_node'
  path: number[]
  properties: NodeJSON
  newProperties: NodeJSON
  data: any
}

type SplitNodeOperation = {
  type: 'split_node'
  path: number[]
  position: number
  target: number
  properties: NodeJSON
  data: any
}

type SetSelectionOperation = {
  type: 'set_selection'
  properties: SelectionJSON
  newProperties: SelectionJSON
  data: any
}

type SetValueOperation = {
  type: 'set_value'
  properties: ValueJSON
  newProperties: ValueJSON
  data: any
}

type Operation =
  | InsertTextOperation
  | RemoveTextOperation
  | AddMarkOperation
  | RemoveMarkOperation
  | SetMarkOperation
  | AddAnnotationOperation
  | RemoveAnnotationOperation
  | SetAnnotationOperation
  | InsertNodeOperation
  | MergeNodeOperation
  | MoveNodeOperation
  | RemoveNodeOperation
  | SetNodeOperation
  | SplitNodeOperation
  | SetSelectionOperation
  | SetValueOperation

export type RichTextOperationDTO = Operation
