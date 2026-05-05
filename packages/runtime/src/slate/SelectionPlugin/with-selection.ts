import { ReactEditor } from 'slate-react'
import { type BaseEditor, type Editor } from 'slate'

type Rect = {
  top: number
  left: number
  width: number
  height: number
}

export interface SelectionEditor extends BaseEditor {
  selectionInProgress: boolean
  getSelectionRects(): Rect[] | null
}

// Editor decorator; applied manually to keep the `slate-react` dependency
// out of the plugin definition
export function withSelection(editor: Editor): Editor {
  editor.selectionInProgress = false
  editor.getSelectionRects = () => {
    const { selection } = editor
    if (selection == null) return null

    try {
      // Slate's selection -> DOM node resolution can throw
      const domRange = ReactEditor.toDOMRange(editor, selection)
      if (domRange.collapsed) return []

      const window = ReactEditor.getWindow(editor)
      return [...domRange.getClientRects()].map(clientRect => {
        clientRect.x += window.scrollX
        clientRect.y += window.scrollY
        return clientRect
      })
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  return editor
}
