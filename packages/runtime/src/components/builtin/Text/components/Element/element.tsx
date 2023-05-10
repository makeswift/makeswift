import { RenderElementProps } from 'slate-react'
import { BlockElement } from './block'
import { InlineElement } from './inline'
import { InlineType, BlockType } from '../../../../../slate'

export function Element({ element, ...props }: RenderElementProps) {
  switch (element.type) {
    case InlineType.Code:
    case InlineType.SuperScript:
    case InlineType.SubScript:
    case InlineType.Link:
      return <InlineElement element={element} {...props} />
    case BlockType.Paragraph:
    case BlockType.Heading1:
    case BlockType.Heading2:
    case BlockType.Heading3:
    case BlockType.BlockQuote:
    case BlockType.OrderedList:
    case BlockType.UnorderedList:
    case BlockType.ListItem:
    case BlockType.ListItemChild:
      return <BlockElement element={element} {...props} />
    default:
      return <span {...props.attributes}>{props.children}</span>
  }
}
