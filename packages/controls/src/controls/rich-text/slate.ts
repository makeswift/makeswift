import {
  Element as SlateElement,
  Text as SlateText,
  type Descendant,
  type Node,
} from 'slate'

import { type ResolvedColorData, type ResponsiveValue } from '../../common'

import { type DataType } from '../associated-types'
import { LinkDefinition } from '../link'
import { unstable_TypographyDefinition } from '../typography'

export { type Descendant } from 'slate'

export const RootBlockType = {
  Default: 'default',
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

export type RootBlockType = (typeof RootBlockType)[keyof typeof RootBlockType]

export const BlockType = {
  ...RootBlockType,
  ListItem: 'list-item',
  ListItemChild: 'list-item-child',
} as const

export type BlockType = (typeof BlockType)[keyof typeof BlockType]

export type Typography = DataType<unstable_TypographyDefinition>

export type Children = Array<Element | Text>

export const Text = SlateText
export type Text = {
  text: string
  typography?: Typography
  color?: ResponsiveValue<ResolvedColorData>
  slice?: boolean
  className?: string
  translationKey?: string
}

// reimplemented from slate source for code splitting
export function isText(node: any): node is Text {
  if (typeof node === 'object' && 'text' in node) return true

  return false
}

export const BlockTextAlignment = {
  Left: 'left',
  Center: 'center',
  Right: 'right',
  Justify: 'justify',
} as const

export type BlockTextAlignment =
  (typeof BlockTextAlignment)[keyof typeof BlockTextAlignment]

export type ResponsiveBlockTextAlignment = ResponsiveValue<BlockTextAlignment>

type BlockElement<T extends BlockType> = {
  type: T
  textAlign?: ResponsiveBlockTextAlignment
  className?: string
  children: Children
  slice?: boolean
  typography?: Typography
}

export type DefaultElement = BlockElement<typeof BlockType.Default>

export function isDefaultElement(node: Node): node is DefaultElement {
  return Element.isElementType(node, BlockType.Default)
}

export type ParagraphElement = BlockElement<typeof BlockType.Paragraph>
export type Heading1Element = BlockElement<typeof BlockType.Heading1>
export type Heading2Element = BlockElement<typeof BlockType.Heading2>
export type Heading3Element = BlockElement<typeof BlockType.Heading3>
export type Heading4Element = BlockElement<typeof BlockType.Heading4>
export type Heading5Element = BlockElement<typeof BlockType.Heading5>
export type Heading6Element = BlockElement<typeof BlockType.Heading6>
export type BlockQuoteElement = BlockElement<typeof BlockType.BlockQuote>
export type UnorderedListElement = BlockElement<typeof BlockType.UnorderedList>
export type OrderedListElement = BlockElement<typeof BlockType.OrderedList>

export type ListElement = OrderedListElement | UnorderedListElement

export function isList(node: Node): node is ListElement {
  return (
    Element.isElementType(node, BlockType.OrderedList) ||
    Element.isElementType(node, BlockType.UnorderedList)
  )
}

export type ListItemElement = BlockElement<typeof BlockType.ListItem>

export function isListItem(node: Node): node is ListItemElement {
  return Element.isElementType(node, BlockType.ListItem)
}

export type ListItemChildElement = BlockElement<typeof BlockType.ListItemChild>

export function isListItemChild(node: Node): node is ListItemChildElement {
  return Element.isElementType(node, BlockType.ListItemChild)
}

export function isConvertibleToListTextNode(node: Node) {
  return !isList(node) && !isListItem(node) && !isListItemChild(node)
}

export type HeadingElement =
  | Heading1Element
  | Heading2Element
  | Heading3Element
  | Heading4Element
  | Heading5Element
  | Heading6Element

export function isHeading(node: Node): node is HeadingElement {
  return (
    Element.isElementType(node, BlockType.Heading1) ||
    Element.isElementType(node, BlockType.Heading2) ||
    Element.isElementType(node, BlockType.Heading3) ||
    Element.isElementType(node, BlockType.Heading3) ||
    Element.isElementType(node, BlockType.Heading4) ||
    Element.isElementType(node, BlockType.Heading5) ||
    Element.isElementType(node, BlockType.Heading6)
  )
}

export type RootBlock =
  | ParagraphElement
  | BlockQuoteElement
  | HeadingElement
  | ListElement
  | DefaultElement

export function isRootBlock(node: Node): node is RootBlock {
  return (
    Element.isElement(node) &&
    (Element.isElementType(node, BlockType.Paragraph) ||
      Element.isElementType(node, BlockType.BlockQuote) ||
      isHeading(node) ||
      isList(node) ||
      isDefaultElement(node))
  )
}

export type Block = RootBlock | ListItemElement | ListItemChildElement

export function isBlock(node: Node): node is Block {
  return (
    Element.isElement(node) &&
    (isRootBlock(node) ||
      Element.isElementType(node, BlockType.ListItem) ||
      Element.isElementType(node, BlockType.ListItemChild))
  )
}

export const InlineType = {
  Code: 'code',
  SuperScript: 'superscript',
  SubScript: 'subscript',
  Link: 'link',
} as const

export type InlineType = (typeof InlineType)[keyof typeof InlineType]

export type InlineChildren = Array<Text | Inline>

type InlineElement<T extends InlineType> = {
  type: T
  className?: string
  children: Array<Text | Inline>
  slice?: boolean
  typography?: Typography
  translationKey?: string
}

export type CodeElement = InlineElement<typeof InlineType.Code>
export type SuperElement = InlineElement<typeof InlineType.SuperScript>
export type SubElement = InlineElement<typeof InlineType.SubScript>
export type LinkElement = InlineElement<typeof InlineType.Link> & {
  link?: DataType<LinkDefinition>
}

export function isLink(node: unknown): node is LinkElement {
  return Element.isElement(node) && Element.isElementType(node, InlineType.Link)
}

export type Inline = CodeElement | SuperElement | SubElement | LinkElement

export function isInline(node: unknown): node is Inline {
  return (
    Element.isElement(node) &&
    (Element.isElementType(node, InlineType.Code) ||
      Element.isElementType(node, InlineType.Link) ||
      Element.isElementType(node, InlineType.SubScript) ||
      Element.isElementType(node, InlineType.SuperScript))
  )
}

export const Element = SlateElement
export type Element = Block | Inline

export type RichTextDAO = Descendant[]

declare module 'slate' {
  interface CustomTypes {
    Element: Element
    Text: Text
  }
}
