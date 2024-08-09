import { Editor, type Path, type NodeEntry } from 'slate'
import { Slate } from '@makeswift/controls'

export const EditorUtils = {
  getFirstAncestorList(
    editor: Editor,
    path: Path,
  ): NodeEntry<Slate.Element & Slate.ListElement> | null {
    try {
      const parentList = Editor.above(editor, {
        at: path,
        match: Slate.isList,
      })
      return parentList ?? null
    } catch (e) {
      return null
    }
  },

  getFirstAncestorListItem(editor: Editor, path: Path): NodeEntry<Slate.ListItemElement> | null {
    try {
      const parentListItem = Editor.above(editor, {
        at: path,
        match: Slate.isListItem,
      })

      return parentListItem ?? null
    } catch (e) {
      return null
    }
  },
}
