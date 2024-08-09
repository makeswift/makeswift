import { ComponentType } from 'react'
import { Slate, type RichTextTypography, type DataType } from '@makeswift/controls'

import { LinkDefinition } from '../../controls'
import { BlockType, InlineType } from '..'

type Children = string | JSX.Element | (string | JSX.Element)[]

export type BaseBlock = {
  children?: Children
  textAlign?: Slate.ResponsiveBlockTextAlignment
  typography?: RichTextTypography
}
export type BaseInline = { children?: Children; typography?: RichTextTypography }

export const Fragment = 'fragment' as unknown as ComponentType<{ children?: Children }>
export const Anchor = 'anchor' as unknown as ComponentType
export const Focus = 'focus' as unknown as ComponentType
export const Cursor = 'cursor' as unknown as ComponentType

export const Text = 'text' as unknown as ComponentType<{
  children?: Children
  text?: string
  typography?: RichTextTypography
}>

export const DefaultBlock = BlockType.Default as unknown as ComponentType<BaseBlock>
export const Paragraph = BlockType.Paragraph as unknown as ComponentType<BaseBlock>
export const Heading1 = BlockType.Heading1 as unknown as ComponentType<BaseBlock>
export const Heading2 = BlockType.Heading2 as unknown as ComponentType<BaseBlock>
export const Heading3 = BlockType.Heading3 as unknown as ComponentType<BaseBlock>
export const Heading4 = BlockType.Heading4 as unknown as ComponentType<BaseBlock>
export const Heading5 = BlockType.Heading5 as unknown as ComponentType<BaseBlock>
export const Heading6 = BlockType.Heading6 as unknown as ComponentType<BaseBlock>
export const BlockQuote = BlockType.BlockQuote as unknown as ComponentType<BaseBlock>
export const Ordered = BlockType.OrderedList as unknown as ComponentType<BaseBlock>
export const Unordered = BlockType.UnorderedList as unknown as ComponentType<BaseBlock>
export const ListItem = BlockType.ListItem as unknown as ComponentType<BaseBlock>
export const ListItemChild = BlockType.ListItemChild as unknown as ComponentType<BaseBlock>

export const Code = InlineType.Code as unknown as ComponentType<BaseInline>
export const Super = InlineType.SuperScript as unknown as ComponentType<BaseInline>
export const Sub = InlineType.SubScript as unknown as ComponentType<BaseInline>
export const Link = InlineType.Link as unknown as ComponentType<{
  children?: Children
  link?: DataType<LinkDefinition>
}>
