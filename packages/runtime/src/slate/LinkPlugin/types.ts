import { type Node, type NodeEntry, Element } from 'slate'
import { Slate } from '@makeswift/controls'

export function isLinkEntry(inline: NodeEntry<Node>): inline is NodeEntry<Slate.LinkElement> {
  return Slate.isInline(inline[0]) && Element.isElementType(inline[0], Slate.InlineType.Link)
}
