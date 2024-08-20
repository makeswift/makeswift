import { Editor, Transforms } from 'slate'
import { Slate } from '@makeswift/controls'

import { getSelection } from '../selectors'

export function wrapInline(editor: Editor, inline: Slate.Inline) {
  Transforms.wrapNodes(editor, inline, {
    at: getSelection(editor),
    split: true,
  })
}
