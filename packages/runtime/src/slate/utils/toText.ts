import { type Descendant } from 'slate'
import { Slate } from '@makeswift/controls'

import { RichText, RichTextV2Mode } from '../../controls/rich-text-v2'

function isBlock(descendant: Descendant): descendant is Slate.Block {
  if (Slate.isText(descendant)) return false
  return Slate.isBlock(descendant)
}

function getTextByDescendant(descendant: Descendant, mode: RichTextV2Mode): string {
  if (Slate.isText(descendant)) {
    return descendant.text ?? ''
  }

  if (Slate.isDefaultElement(descendant)) {
    return mode === RichText.Mode.Inline
      ? descendant.children.map(descendant => getTextByDescendant(descendant, mode)).join('') ?? ''
      : descendant.children
          .map(descendant => getTextByDescendant(descendant, mode))
          .join(descendant.children.every(isBlock) ? '\n' : '') ?? ''
  }

  if (Slate.isBlock(descendant)) {
    return (
      descendant.children
        .map(descendant => getTextByDescendant(descendant, mode))
        .join(descendant.children.every(isBlock) ? '\n' : '') ?? ''
    )
  }

  if (Slate.isInline(descendant)) {
    return (
      descendant.children.map(descendant => getTextByDescendant(descendant, mode)).join('') ?? ''
    )
  }

  return ''
}

export function toText(descendants: Descendant[], mode: RichTextV2Mode): string {
  return descendants.map(node => getTextByDescendant(node, mode)).join('\n')
}
