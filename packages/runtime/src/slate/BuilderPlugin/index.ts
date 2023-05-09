import { BaseEditor, Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

export interface BuilderEditor extends BaseEditor {
  focusAndSelectAll: () => void
  deselectAndBlur: () => void
}

export function withBuilder(editor: Editor) {
  editor.deselectAndBlur = function () {
    ReactEditor.deselect(editor)
    ReactEditor.blur(editor)
  }

  editor.focusAndSelectAll = function () {
    ReactEditor.focus(editor)
    Transforms.select(editor, {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    })
  }

  return editor
}
