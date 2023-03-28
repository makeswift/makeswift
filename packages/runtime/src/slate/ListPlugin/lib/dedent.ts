import { Editor, Path, Transforms } from 'slate'
import { indentPath } from './indent'
import { getSelectedListItems } from './utils/getSelectedListItems'
import { filterForSubtreeRoots } from './utils/filterForSubtreeRoots'
import { EditorUtils } from './utils/editor'

function dedentPath(editor: Editor, listItemPath: Path) {
  const parentList = EditorUtils.getFirstAncestorList(editor, listItemPath)
  const listItemContainingParentList = EditorUtils.getFirstAncestorListItem(editor, listItemPath)
  if (!parentList || !listItemContainingParentList) return

  const [parentListNode, parentListPath] = parentList
  const [_, listItemContainingParentListPath] = listItemContainingParentList

  const listItemPosition = listItemPath[listItemPath.length - 1]
  const previousSiblings = parentListNode.children.slice(0, listItemPosition)
  const nextSiblings = parentListNode.children.slice(listItemPosition + 1)

  Editor.withoutNormalizing(editor, () => {
    // put next siblings into list item
    nextSiblings.forEach(() => {
      const nextSiblingPath = [...parentListPath, listItemPosition + 1]
      indentPath(editor, nextSiblingPath)
    })
    // move list item to parent list
    Transforms.moveNodes(editor, {
      at: listItemPath,
      to: Path.next(listItemContainingParentListPath),
    })
    // delete old parent list if there are no other list items
    if (previousSiblings.length === 0) {
      Transforms.removeNodes(editor, { at: parentListPath })
    }
  })
}

export function dedent(editor: Editor) {
  if (!editor.selection) return

  const listItems = getSelectedListItems(editor)
  const subRoots = filterForSubtreeRoots(listItems)
  const refs = subRoots.map(([_, path]) => Editor.pathRef(editor, path))

  refs.forEach(ref => {
    if (ref.current) {
      dedentPath(editor, ref.current)
    }
    ref.unref()
  })
}
