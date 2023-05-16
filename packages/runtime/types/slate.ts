import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
import { LinkControlData } from '../src/controls'
import { HistoryEditor } from 'slate-history'
import { BuilderEditor } from '../src/slate'
import { ResponsiveValue } from '../src/prop-controllers'

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
}

export const RootBlockType = {
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

export type TextElement = {
  textAlign?: ResponsiveBlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.Text
}

export type ParagraphElement = {
  textAlign?: ResponsiveBlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.Paragraph
}

export type Heading1Element = {
  textAlign?: ResponsiveBlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.Heading1
}

export type Heading2Element = {
  textAlign?: ResponsiveBlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.Heading2
}

export type Heading3Element = {
  textAlign?: ResponsiveBlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.Heading3
}

export type Heading4Element = {
  textAlign?: ResponsiveBlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.Heading4
}

export type Heading5Element = {
  textAlign?: ResponsiveBlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.Heading5
}

export type Heading6Element = {
  textAlign?: ResponsiveBlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.Heading6
}

export type BlockQuoteElement = {
  textAlign?: ResponsiveBlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.BlockQuote
}

export type UnorderedListElement = {
  textAlign?: ResponsiveBlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.UnorderedList
}

export type OrderedListElement = {
  textAlign?: ResponsiveBlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.OrderedList
}

export type ListElement = OrderedListElement | UnorderedListElement

export type ListItemElement = {
  textAlign?: ResponsiveBlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.ListItem
}

export type ListItemChildElement = {
  textAlign?: ResponsiveBlockTextAlignment
  children: Array<Element | Text>
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
}

export type SuperElement = {
  children: Array<Text | Inline>
  type: typeof InlineType.SuperScript
}

export type SubElement = {
  children: Array<Text | Inline>
  type: typeof InlineType.SubScript
}

export type LinkElement = {
  children: Array<Text | Inline>
  type: typeof InlineType.Link
  link: LinkControlData
}

export type RootBlock =
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