import { ReactEditor } from 'slate-react'
import { type BaseEditor, type Editor } from 'slate'

type BoundingRect = {
  top: number
  left: number
  bottom: number
  right: number
}

export interface SelectionEditor extends BaseEditor {
  getSelectionBoundingRect(): BoundingRect | null
}

// Editor decorator; applied manually to keep the `slate-react` dependency
// out of the plugin definition
export function withSelection(editor: Editor): Editor {
  editor.getSelectionBoundingRect = () => {
    const { selection } = editor
    if (selection == null) return null

    try {
      // Slate's selection -> DOM node resolution can throw
      const domRange = ReactEditor.toDOMRange(editor, selection)
      return domRange.getBoundingClientRect()
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  return editor
}
