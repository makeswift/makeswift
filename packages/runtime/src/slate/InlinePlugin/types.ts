import { Slate, unstable_IconRadioGroupIcon } from '@makeswift/controls'
import { Node, NodeEntry } from 'slate'

export type SupportedInlineType = Exclude<Slate.InlineType, 'link'>
export type SupportedInline = Exclude<Slate.Inline, Slate.LinkElement>

export const supportedInlineOptions = [
  {
    icon: unstable_IconRadioGroupIcon.Superscript,
    label: 'Superscript',
    value: 'superscript',
  },
  {
    icon: unstable_IconRadioGroupIcon.Subscript,
    label: 'Subscript',
    value: 'subscript',
  },
  {
    icon: unstable_IconRadioGroupIcon.Code,
    label: 'Code',
    value: 'code',
  },
] as const

export function isSupportedInlineType(inline: Slate.InlineType): inline is SupportedInlineType {
  return supportedInlineOptions.findIndex(option => option.value === inline) !== -1
}

export function isSupportedInlineNode(node: Node): node is SupportedInline {
  return Slate.isInline(node) && isSupportedInlineType(node.type)
}

export function isSupportedInlineEntry(
  entry: NodeEntry<Node>,
): entry is NodeEntry<SupportedInline> {
  return isSupportedInlineNode(entry[0])
}
