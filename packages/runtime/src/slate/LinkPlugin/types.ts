import { Node, NodeEntry } from 'slate'
import { ElementUtils } from '../utils/element'
import { InlineType, LinkElement } from '../types'

export function isLinkElement(node: Node): node is LinkElement {
  return ElementUtils.isInline(node) && node.type === InlineType.Link
}

export function isLinkEntry(inline: NodeEntry<Node>): inline is NodeEntry<LinkElement> {
  return ElementUtils.isInline(inline[0]) && inline[0].type === InlineType.Link
}
