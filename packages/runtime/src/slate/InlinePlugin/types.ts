import { Slate, unstable_IconRadioGroup } from '@makeswift/controls'
import { Node, NodeEntry } from 'slate'

export type SupportedInlineType = Exclude<Slate.InlineType, 'link'>
export type SupportedInline = Exclude<Slate.Inline, Slate.LinkElement>

export const supportedInlineOptions = [
  {
    icon: unstable_IconRadioGroup.Icon.Superscript,
    label: 'Superscript',
    value: 'superscript',
  },
  {
    icon: unstable_IconRadioGroup.Icon.Subscript,
    label: 'Subscript',
    value: 'subscript',
  },
  {
    icon: unstable_IconRadioGroup.Icon.Code,
    label: 'Code',
    value: 'code',
  },
  {
    icon: unstable_IconRadioGroup.Icon.Code,
    label: 'KBD',
    value: 'kbd',
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
