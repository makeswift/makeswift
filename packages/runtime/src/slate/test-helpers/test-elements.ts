import { ComponentType } from 'react'
import { ResponsiveBlockTextAlignment, RichTextTypography } from '../../controls'

type Children = string | JSX.Element | (string | JSX.Element)[]

export type BaseBlock = { children?: Children; textAlign?: ResponsiveBlockTextAlignment }

export const Fragment = 'fragment' as any as ComponentType<{ children?: Children }>
export const Anchor = 'anchor' as any as ComponentType<{}>
export const Focus = 'focus' as any as ComponentType<{}>
export const Cursor = 'cursor' as any as ComponentType<{}>

export const Text = 'text' as any as ComponentType<{
  children?: Children
  text?: string
  typography?: RichTextTypography
}>

export const Paragraph = 'paragraph' as any as ComponentType<BaseBlock>
export const Heading1 = 'heading1' as any as ComponentType<BaseBlock>
export const Heading2 = 'heading2' as any as ComponentType<BaseBlock>
export const Heading3 = 'heading3' as any as ComponentType<BaseBlock>
export const Heading4 = 'heading4' as any as ComponentType<BaseBlock>
export const Heading5 = 'heading5' as any as ComponentType<BaseBlock>
export const Heading6 = 'heading6' as any as ComponentType<BaseBlock>
export const BlockQuote = 'blockquote' as any as ComponentType<BaseBlock>
export const Ordered = 'ordered' as any as ComponentType<BaseBlock>
export const Unordered = 'unordered' as any as ComponentType<BaseBlock>
export const ListItem = 'listitem' as any as ComponentType<BaseBlock>
export const ListItemChild = 'listitemchild' as any as ComponentType<BaseBlock>
