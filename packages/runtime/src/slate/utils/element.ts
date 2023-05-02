import { Node, Element } from 'slate'
import {
  BlockType,
  Block,
  ParagraphElement,
  OrderedListElement,
  UnorderedListElement,
  ListItemElement,
  ListItemChildElement,
  Inline,
  InlineType,
} from '../../controls'

export const ElementUtils = {
  isBlock(node: Node): node is Block {
    return (
      Element.isElement(node) &&
      (Element.isElementType(node, BlockType.Paragraph) ||
        Element.isElementType(node, BlockType.Heading1) ||
        Element.isElementType(node, BlockType.Heading2) ||
        Element.isElementType(node, BlockType.Heading3) ||
        Element.isElementType(node, BlockType.Heading3) ||
        Element.isElementType(node, BlockType.Heading4) ||
        Element.isElementType(node, BlockType.Heading5) ||
        Element.isElementType(node, BlockType.Heading6) ||
        Element.isElementType(node, BlockType.BlockQuote) ||
        Element.isElementType(node, BlockType.UnorderedList) ||
        Element.isElementType(node, BlockType.OrderedList) ||
        Element.isElementType(node, BlockType.ListItem) ||
        Element.isElementType(node, BlockType.ListItemChild))
    )
  },
  isInline(node: Node): node is Inline {
    return (
      Element.isElementType(node, InlineType.Code) ||
      Element.isElementType(node, InlineType.Link) ||
      Element.isElementType(node, InlineType.SubScript) ||
      Element.isElementType(node, InlineType.SuperScript)
    )
  },
  isConvertibleToListTextNode(node: Node) {
    return !this.isList(node) && !this.isListItem(node) && !this.isListItemChild(node)
  },
  isParagraph(node: Node): node is ParagraphElement {
    return Element.isElementType(node, BlockType.Paragraph)
  },
  isList(node: Node): node is OrderedListElement | UnorderedListElement {
    return (
      Element.isElementType(node, BlockType.OrderedList) ||
      Element.isElementType(node, BlockType.UnorderedList)
    )
  },
  isListItem(node: Node): node is ListItemElement {
    return Element.isElementType(node, BlockType.ListItem)
  },
  isListItemChild(node: Node): node is ListItemChildElement {
    return Element.isElementType(node, BlockType.ListItemChild)
  },
  createText() {
    return { text: '' }
  },
  createParagraph() {
    return {
      children: [this.createText()],
      type: BlockType.Paragraph,
    }
  },
  createList(type: BlockType = BlockType.UnorderedList): Block {
    return { children: [this.createText()], type }
  },
  createListItem(): Block {
    return {
      children: [this.createText()],
      type: BlockType.ListItem,
    }
  },
  createListItemChild(): Block {
    return {
      children: [this.createText()],
      type: BlockType.ListItemChild,
    }
  },
}
