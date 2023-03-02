import { BaseEditor, Descendant, BaseOperation } from 'slate'
import { ReactEditor } from 'slate-react'
import { Typography } from '../../api'
import { LinkControlData } from '../link'
import { ResponsiveValue } from '../types'

export type TypographyMarkValue = {
  id: string | null | undefined
  style: Typography['style']
}

export const TextType = {
  Typography: 'typography',
  Text: 'text',
} as const

export type TextType = typeof TextType[keyof typeof TextType]

export type TypographyText = {
  type: typeof TextType.Typography
  text: string
  typography: TypographyMarkValue
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

const BasicInlineType = {
  Code: 'code',
  SuperScript: 'superscript',
  SubScript: 'subscript',
} as const

export type BasicInlineType = typeof BasicInlineType[keyof typeof BasicInlineType]

export const InlineType = {
  ...BasicInlineType,
  Link: 'link',
} as const

export type InlineType = typeof InlineType[keyof typeof InlineType]

type BaseBlockElement = {
  textAlign?: ResponsiveValue<'left' | 'center' | 'right' | 'justify'>
  children: Array<Descendant>
  type: BlockType
}

type BaseInlineElement = {
  children: Array<Text | Inline>
  type: BasicInlineType
}

type LinkInlineElement = {
  children: Array<Text | Inline>
  type: typeof InlineType.Link
  link: LinkControlData
}

export type Block = BaseBlockElement
export type Inline = BaseInlineElement | LinkInlineElement

export type Element = Block | Inline

export type RichTextDAO = Descendant[]

export type MakeswiftOperation = BaseOperation & {
  origin?: 'host' | 'builder'
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: Element
    Text: Text
    Operation: MakeswiftOperation
  }
}
