import { type RenderElementProps } from 'slate-react'
import { Slate } from '@makeswift/controls'

import { BlockElement } from './block'
import { InlineElement } from './inline'

export function Element({ element, ...props }: RenderElementProps) {
  if (Slate.isInline(element)) {
    return <InlineElement element={element} {...props} />
  }

  if (Slate.isBlock(element)) {
    return <BlockElement element={element} {...props} />
  }

  return <span {...props.attributes}>{props.children}</span>
}
