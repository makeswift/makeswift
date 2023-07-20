import { Descendant, Text } from 'slate'
import { RichTextV2Mode } from '../../controls'
import { Block, BlockType, InlineType } from '../types'

// reimplemented from slate source for code splitting
function isText(node: Descendant): node is Text {
  if (typeof node === 'object' && 'text' in node) return true

  return false
}

function isBlock(descendant: Descendant): descendant is Block {
  if (isText(descendant)) return false

  switch (descendant.type) {
    case BlockType.Heading1:
    case BlockType.Heading2:
    case BlockType.Heading3:
    case BlockType.Heading4:
    case BlockType.Heading5:
    case BlockType.Heading6:
    case BlockType.BlockQuote:
    case BlockType.Paragraph:
    case BlockType.Default:
    case BlockType.OrderedList:
    case BlockType.UnorderedList:
    case BlockType.ListItem:
    case BlockType.ListItemChild:
      return true

    default:
      return false
  }
}

function getTextByDescendant(descendant: Descendant, mode: RichTextV2Mode): string {
  if (isText(descendant)) {
    return descendant.text ?? ''
  }

  switch (descendant.type) {
    case BlockType.Default:
      return mode === RichTextV2Mode.Inline
        ? descendant.children.map(descendant => getTextByDescendant(descendant, mode)).join('') ??
            ''
        : descendant.children
            .map(descendant => getTextByDescendant(descendant, mode))
            .join(descendant.children.every(isBlock) ? '\n' : '') ?? ''

    case InlineType.Link:
    case InlineType.Code:
    case InlineType.SubScript:
    case InlineType.SuperScript:
      return (
        descendant.children.map(descendant => getTextByDescendant(descendant, mode)).join('') ?? ''
      )
    case BlockType.Heading1:
    case BlockType.Heading2:
    case BlockType.Heading3:
    case BlockType.Heading4:
    case BlockType.Heading5:
    case BlockType.Heading6:
    case BlockType.BlockQuote:
    case BlockType.Paragraph:
    case BlockType.OrderedList:
    case BlockType.UnorderedList:
    case BlockType.ListItem:
    case BlockType.ListItemChild:
      return (
        descendant.children
          .map(descendant => getTextByDescendant(descendant, mode))
          .join(descendant.children.every(isBlock) ? '\n' : '') ?? ''
      )
    default:
      return ''
  }
}

export function toText(descendant: Descendant[], mode: RichTextV2Mode): string {
  return descendant.map(node => getTextByDescendant(node, mode)).join('\n')
}
