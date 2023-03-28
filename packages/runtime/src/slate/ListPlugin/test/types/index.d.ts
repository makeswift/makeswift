import { Typography as TypographyType } from '../../../../api'
import { BlockTextAlignment } from '../../../../controls'
import {
  Anchor,
  BlockQuote,
  Cursor,
  Editor,
  Focus,
  Fragment,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  ListItem,
  ListItemChild,
  Ordered,
  Paragraph,
  Selection,
  Text,
  Unordered,
} from '../types'

type Children = string | JSX.Element | (string | JSX.Element)[]

export type BaseBlock = { children?: Children; textAlign?: BlockTextAlignment }

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [Editor]: { children: Children }

      [Anchor]: {}
      [Focus]: {}
      [Selection]: { children?: Children }
      [Cursor]: {}
      [Fragment]: {}

      [Text]: { children?: Children; text?: string }

      [Paragraph]: BaseBlock

      [BlockQuote]: BaseBlock

      [Heading1]: BaseBlock
      [Heading2]: BaseBlock
      [Heading3]: BaseBlock
      [Heading4]: BaseBlock
      [Heading5]: BaseBlock
      [Heading6]: BaseBlock

      [Unordered]: BaseBlock
      [Ordered]: BaseBlock
      [ListItem]: BaseBlock
      [ListItemChild]: BaseBlock
    }
  }
}
