import { Node, Element, Text } from 'slate'
import {
  TextType,
  BlockType,
  Block,
  ParagraphElement,
  OrderedListElement,
  UnorderedListElement,
  ListItemElement,
  ListItemChildElement,
} from '../../../../../../../controls'

export const ElementUtils = {
  isConvertibleToListTextNode(node: Node) {
    return (
      !this.isList(node) &&
      !this.isListItem(node) &&
      !this.isListItemChild(node) &&
      !this.isText(node) &&
      !this.isTypography(node)
    )
  },
  isText(node: Node) {
    return Element.isElementType(node, TextType.Text) || Text.isText(node)
  },
  isTypography(node: Node) {
    return Element.isElementType(node, TextType.Typography)
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
    return { text: '', type: TextType.Text }
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
