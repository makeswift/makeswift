import { type Editor } from 'slate'
import { ReactEditor } from 'slate-react'

export const getHTMLElement = (editor: Editor) => ReactEditor.toDOMNode(editor, editor)
