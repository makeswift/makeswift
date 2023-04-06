import { Path, Editor, NodeEntry } from 'slate'
import { ListElement, ListItemElement } from '../../controls'
import { ElementUtils } from './element'

export const EditorUtils = {
  getFirstAncestorList(editor: Editor, path: Path): NodeEntry<ListElement> | null {
    try {
      const parentList = Editor.above(editor, {
        at: path,
        match: (node): node is ListElement => ElementUtils.isList(node),
      })
      return parentList ?? null
    } catch (e) {
      return null
    }
  },
  getFirstAncestorListItem(editor: Editor, path: Path): NodeEntry<ListItemElement> | null {
    try {
      const parentListItem = Editor.above(editor, {
        at: path,
        match: (node): node is ListItemElement => ElementUtils.isListItem(node),
      })

      return parentListItem ?? null
    } catch (e) {
      return null
    }
  },
}