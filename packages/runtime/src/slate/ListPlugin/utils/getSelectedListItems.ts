import type { Element, NodeEntry } from 'slate'
import { Editor, Path } from 'slate'
import { EditorUtils } from '../../utils/editor'
import { ElementUtils } from '../../utils/element'
import { LocationUtils } from './location'

export function getSelectedListItems(editor: Editor): NodeEntry<Element>[] {
  if (!editor.selection) return []

  const start = LocationUtils.getStartPath(editor.selection)
  const listItems = Editor.nodes(editor, {
    at: editor.selection,
    match: node => ElementUtils.isListItem(node),
  })
  const firstAncestorPath = EditorUtils.getFirstAncestorListItem(editor, start)?.[1] ?? []

  return Array.from(listItems).filter((node): node is NodeEntry<Element> =>
    Path.isDescendant(start, node[1])
      ? Path.equals(node[1], firstAncestorPath)
      : !Path.isAfter(start, node[1]),
  )
}

export function getSelectedLists(editor: Editor): NodeEntry<Element>[] {
  if (!editor.selection) return []

  const start = LocationUtils.getStartPath(editor.selection)
  const lists = Editor.nodes(editor, {
    at: editor.selection,
    match: node => ElementUtils.isList(node),
  })
  const firstAncestorPath = EditorUtils.getFirstAncestorList(editor, start)?.[1] ?? []

  return Array.from(lists).filter((node): node is NodeEntry<Element> =>
    Path.isDescendant(start, node[1])
      ? Path.equals(node[1], firstAncestorPath)
      : !Path.isAfter(start, node[1]),
  )
}
