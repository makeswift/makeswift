import { Editor, Transforms } from 'slate'
import { ElementUtils } from '../utils/element'
import { getSelection } from '../selectors'
import { InlineType } from '../types'

export function unwrapInline(editor: Editor, type: InlineType) {
  Transforms.unwrapNodes(editor, {
    match: node => ElementUtils.isInline(node) && node.type === type,
    at: getSelection(editor),
  })
}
