import { Editor, Transforms } from 'slate'
import { getSelection } from '../selectors'
import { Inline } from '../../controls'

export function wrapInline(editor: Editor, inline: Inline) {
  Transforms.wrapNodes(editor, inline, {
    at: getSelection(editor),
    split: true,
  })
}
