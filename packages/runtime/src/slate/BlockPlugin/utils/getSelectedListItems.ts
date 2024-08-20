import type { NodeEntry } from 'slate'
import { Editor, Path } from 'slate'
import { Slate } from '@makeswift/controls'

import { EditorUtils } from '../../utils/editor'
import { LocationUtils } from './location'

export function getSelectedListItems(editor: Editor): NodeEntry<Slate.Element>[] {
  if (!editor.selection) return []

  const start = LocationUtils.getStartPath(editor.selection)
  const listItems = Editor.nodes(editor, {
    at: editor.selection,
    match: Slate.isListItem,
  })

  const firstAncestorPath = EditorUtils.getFirstAncestorListItem(editor, start)?.[1] ?? []

  return Array.from(listItems).filter(node =>
    Path.isDescendant(start, node[1])
      ? Path.equals(node[1], firstAncestorPath)
      : !Path.isAfter(start, node[1]),
  )
}
