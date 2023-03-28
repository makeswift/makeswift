import { Editor, Transforms, Path, Node } from 'slate'
import { BlockType } from '../../../controls'
import { LIST_ITEM_CHILD_POSITION, LIST_ITEM_LIST_POSITION } from '../constants'
import { EditorUtils } from './utils/editor'
import { filterForSubtreeRoots } from './utils/filterForSubtreeRoots'
import { getSelectedListItems } from './utils/getSelectedListItems'

export function unwrapPath(editor: Editor, listItemPath: Path) {
  const parentList = EditorUtils.getFirstAncestorList(editor, listItemPath)
  const listItemContainingParentList = EditorUtils.getFirstAncestorListItem(editor, listItemPath)
  //if this is a nested item we don't want to unwrap it
  if (!parentList || listItemContainingParentList) return

  Editor.withoutNormalizing(editor, () => {
    const listItemTextPath = [...listItemPath, LIST_ITEM_CHILD_POSITION]
    const listItemNestedListPath = [...listItemPath, LIST_ITEM_LIST_POSITION]

    if (Node.has(editor, listItemNestedListPath)) {
      Transforms.setNodes(editor, { type: parentList[0].type }, { at: listItemNestedListPath })
      Transforms.liftNodes(editor, { at: listItemNestedListPath })
      Transforms.liftNodes(editor, { at: Path.next(listItemPath) })
    }

    if (Node.has(editor, listItemTextPath)) {
      Transforms.setNodes(
        editor,
        { type: BlockType.Paragraph },
        {
          at: listItemTextPath,
        },
      )
      Transforms.liftNodes(editor, { at: listItemTextPath })
      Transforms.liftNodes(editor, { at: listItemPath })
    }
  })
}

export function unwrapList(editor: Editor) {
  if (!editor.selection) return

  const listItems = getSelectedListItems(editor)
  const subRoots = filterForSubtreeRoots(listItems)
  const refs = subRoots.map(([_, path]) => Editor.pathRef(editor, path))

  refs.forEach(ref => {
    if (ref.current) {
      unwrapPath(editor, ref.current)
    }
    ref.unref()
  })
}
