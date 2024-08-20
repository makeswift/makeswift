import { Editor, Transforms } from 'slate'
import { Slate } from '@makeswift/controls'

import { getSelection } from '../selectors'

export function unwrapInline(editor: Editor, type: Slate.InlineType) {
  Transforms.unwrapNodes(editor, {
    match: node => Slate.isInline(node) && node.type === type,
    at: getSelection(editor),
  })
}
