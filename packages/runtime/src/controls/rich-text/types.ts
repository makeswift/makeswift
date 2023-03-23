import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
import { Typography } from '../../api'
import { LinkControlData } from '../link'
import { ResponsiveValue } from '../types'

export const TextType = {
  Typography: 'typography',
  Text: 'text',
} as const

export type TextType = typeof TextType[keyof typeof TextType]

export type TypographyText = {
  type: typeof TextType.Typography
  text: string
  typography: Typography
}

type BaseText = {
  type: typeof TextType.Text
  text: string
}

export type Text = BaseText | TypographyText

export const BlockType = {
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
  ListItem: 'list-item',
  ListItemChild: 'list-item-child',
} as const

export type BlockType = typeof BlockType[keyof typeof BlockType]

export type ParagraphElement = {
  textAlign?: BlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.Paragraph
}

export type Heading1Element = {
  textAlign?: BlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.Heading1
}

export type Heading2Element = {
  textAlign?: BlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.Heading2
}

export type Heading3Element = {
  textAlign?: BlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.Heading3
}

export type Heading4Element = {
  textAlign?: BlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.Heading4
}

export type Heading5Element = {
  textAlign?: BlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.Heading5
}

export type Heading6Element = {
  textAlign?: BlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.Heading6
}

export type BlockQuoteElement = {
  textAlign?: BlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.BlockQuote
}

export type UnorderedListElement = {
  textAlign?: BlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.UnorderedList
}

export type OrderedListElement = {
  textAlign?: BlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.OrderedList
}

export type ListElement = OrderedListElement | UnorderedListElement

export type ListItemElement = {
  textAlign?: BlockTextAlignment
  children: Array<Element | Text>
  type: typeof BlockType.ListItem
}

export type ListItemChildElement = {
  textAlign?: BlockTextAlignment
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

export type BlockTextAlignment = ResponsiveValue<'left' | 'center' | 'right' | 'justify'>

type CodeElement = {
  children: Array<Text | Inline>
  type: typeof InlineType.Code
}

type SuperElement = {
  children: Array<Text | Inline>
  type: typeof InlineType.SuperScript
}

type SubElement = {
  children: Array<Text | Inline>
  type: typeof InlineType.SubScript
}

type LinkElement = {
  children: Array<Text | Inline>
  type: typeof InlineType.Link
  link: LinkControlData
}

export type Block =
  | ParagraphElement
  | Heading1Element
  | Heading2Element
  | Heading3Element
  | Heading4Element
  | Heading5Element
  | Heading6Element
  | BlockQuoteElement
  | ListElement
  | ListItemElement
  | ListItemChildElement

export type Inline = CodeElement | SuperElement | SubElement | LinkElement

export type Element = Block | Inline

export type RichTextDAO = Descendant[]

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: Element
    Text: Text
  }
}
