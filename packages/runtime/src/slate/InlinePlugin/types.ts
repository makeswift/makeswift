import { Node, NodeEntry } from 'slate'
import { ElementUtils } from '../utils/element'
import { Inline, InlineType, LinkElement } from '../types'
import { IconRadioGroupOption, unstable_IconRadioGroupIcon } from '../../controls'

export type SupportedInlineType = Exclude<InlineType, 'link'>
export type SupportedInline = Exclude<Inline, LinkElement>

export const supportedInlineOptions: IconRadioGroupOption<SupportedInlineType>[] = [
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
]

export function isSupportedInlineType(inline: InlineType): inline is SupportedInlineType {
  return supportedInlineOptions.findIndex(option => option.value === inline) !== -1
}

export function isSupportedInlineEntry(
  entry: NodeEntry<Node>,
): entry is NodeEntry<SupportedInline> {
  const node = entry[0]
  return (
    ElementUtils.isInline(node) &&
    supportedInlineOptions.findIndex(option => option.value === node.type) !== -1
  )
}
