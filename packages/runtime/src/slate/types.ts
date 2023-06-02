import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
import { LinkControlData } from '../controls'
import { HistoryEditor } from 'slate-history'
import { BuilderEditor } from '.'
import { ResponsiveValue } from '../prop-controllers'

export type RichTextTypography = {
  id?: string
  style: Array<{
    deviceId: string
    value: {
      fontFamily?: string | null
      lineHeight?: number | null
      letterSpacing?: number | null
      fontWeight?: number | null
      textAlign?: string | null
      uppercase?: boolean | null
      underline?: boolean | null
      strikethrough?: boolean | null
      italic?: boolean | null
      fontSize?: { value: number | null; unit: string | null } | null
      color?: { swatchId: string | null; alpha: number | null } | null
    }
  }>
}

export type Text = {
  text: string
  typography?: RichTextTypography
  slice?: boolean
  className?: string
}

export const RootBlockType = {
  Default: 'default',
  Text: 'text-block',
  Paragraph: 'paragraph',
  Heading1: 'heading-one',
  Heading2: 'heading-two',
  Heading3: 'heading-three',
  Heading4: 'heading-four',
  Heading5: 'heading-five',
  Heading6: 'heading-six',
  BlockQuote: 'blockquote',
  UnorderedList: 'unordered-list',
  OrderedList: 'ordered-list',
} as const

export type RootBlockType = typeof RootBlockType[keyof typeof RootBlockType]

export const BlockType = {
  ...RootBlockType,
  ListItem: 'list-item',
  ListItemChild: 'list-item-child',
} as const

export type BlockType = typeof BlockType[keyof typeof BlockType]

export type DefaultElement = {
  textAlign?: ResponsiveBlockTextAlignment
  className?: string
  children: Array<Element | Text>
  slice?: boolean
  type: typeof BlockType.Default
}

export type TextElement = {
  textAlign?: ResponsiveBlockTextAlignment
  className?: string
  children: Array<Element | Text>
  slice?: boolean
  type: typeof BlockType.Text
}

export type ParagraphElement = {
  textAlign?: ResponsiveBlockTextAlignment
  className?: string
  children: Array<Element | Text>
  slice?: boolean
  type: typeof BlockType.Paragraph
}

export type Heading1Element = {
  textAlign?: ResponsiveBlockTextAlignment
  className?: string
  children: Array<Element | Text>
  slice?: boolean
  type: typeof BlockType.Heading1
}

export type Heading2Element = {
  textAlign?: ResponsiveBlockTextAlignment
  className?: string
  children: Array<Element | Text>
  slice?: boolean
  type: typeof BlockType.Heading2
}

export type Heading3Element = {
  textAlign?: ResponsiveBlockTextAlignment
  className?: string
  children: Array<Element | Text>
  slice?: boolean
  type: typeof BlockType.Heading3
}

export type Heading4Element = {
  textAlign?: ResponsiveBlockTextAlignment
  className?: string
  children: Array<Element | Text>
  slice?: boolean
  type: typeof BlockType.Heading4
}

export type Heading5Element = {
  textAlign?: ResponsiveBlockTextAlignment
  className?: string
  children: Array<Element | Text>
  slice?: boolean
  type: typeof BlockType.Heading5
}

export type Heading6Element = {
  textAlign?: ResponsiveBlockTextAlignment
  className?: string
  children: Array<Element | Text>
  slice?: boolean
  type: typeof BlockType.Heading6
}

export type BlockQuoteElement = {
  textAlign?: ResponsiveBlockTextAlignment
  className?: string
  children: Array<Element | Text>
  slice?: boolean
  type: typeof BlockType.BlockQuote
}

export type UnorderedListElement = {
  textAlign?: ResponsiveBlockTextAlignment
  className?: string
  children: Array<Element | Text>
  slice?: boolean
  type: typeof BlockType.UnorderedList
}

export type OrderedListElement = {
  textAlign?: ResponsiveBlockTextAlignment
  className?: string
  children: Array<Element | Text>
  slice?: boolean
  type: typeof BlockType.OrderedList
}

export type ListElement = OrderedListElement | UnorderedListElement

export type ListItemElement = {
  textAlign?: ResponsiveBlockTextAlignment
  className?: string
  children: Array<Element | Text>
  slice?: boolean
  type: typeof BlockType.ListItem
}

export type ListItemChildElement = {
  textAlign?: ResponsiveBlockTextAlignment
  className?: string
  children: Array<Element | Text>
  slice?: boolean
  type: typeof BlockType.ListItemChild
}

export const InlineType = {
  Code: 'code',
  SuperScript: 'superscript',
  SubScript: 'subscript',
  Link: 'link',
} as const

export type InlineType = typeof InlineType[keyof typeof InlineType]

export const BlockTextAlignment = {
  Left: 'left',
  Center: 'center',
  Right: 'right',
  Justify: 'justify',
} as const

export type BlockTextAlignment = typeof BlockTextAlignment[keyof typeof BlockTextAlignment]

export type ResponsiveBlockTextAlignment = ResponsiveValue<BlockTextAlignment>

export type CodeElement = {
  children: Array<Text | Inline>
  type: typeof InlineType.Code
  className?: string
  slice?: boolean
}

export type SuperElement = {
  children: Array<Text | Inline>
  type: typeof InlineType.SuperScript
  className?: string
  slice?: boolean
}

export type SubElement = {
  children: Array<Text | Inline>
  type: typeof InlineType.SubScript
  className?: string
  slice?: boolean
}

export type LinkElement = {
  children: Array<Text | Inline>
  type: typeof InlineType.Link
  link: LinkControlData
  className?: string
  slice?: boolean
}

export type RootBlock =
  | DefaultElement
  | TextElement
  | ParagraphElement
  | Heading1Element
  | Heading2Element
  | Heading3Element
  | Heading4Element
  | Heading5Element
  | Heading6Element
  | BlockQuoteElement
  | ListElement

export type Block = RootBlock | ListItemElement | ListItemChildElement

export type Inline = CodeElement | SuperElement | SubElement | LinkElement

export type Element = Block | Inline

export type RichTextDAO = Descendant[]

export type MakeswiftEditor = BaseEditor & ReactEditor & HistoryEditor & BuilderEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: MakeswiftEditor
    Element: Element
    Text: Text
  }
}
