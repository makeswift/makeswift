import { Editor, Node, Path, Transforms } from 'slate'
import { Slate } from '@makeswift/controls'

import { ElementUtils } from '../utils/element'
import { LIST_ITEM_LIST_POSITION } from './constants'
import { filterForSubtreeRoots } from './utils/filterForSubtreeRoots'
import { getSelectedListItems } from './utils/getSelectedListItems'

export function indentPath(editor: Editor, path: Path) {
  const parent = Node.parent(editor, path)
  if (!path || !Path.hasPrevious(path) || !Slate.isList(parent)) return

  const previosPath = Path.previous(path)

  const previousChildListPath = [...previosPath, LIST_ITEM_LIST_POSITION]
  const previousHasChildList = Node.has(editor, previousChildListPath)

  Editor.withoutNormalizing(editor, () => {
    if (!previousHasChildList) {
      Transforms.insertNodes(editor, ElementUtils.createList(parent.type), {
        at: previousChildListPath,
      })
    }

    const previousChildList = Node.get(editor, previousChildListPath)

    if (Slate.isList(previousChildList)) {
      const index = previousHasChildList ? previousChildList.children.length : 0
      Transforms.moveNodes(editor, {
        at: path,
        to: [...previousChildListPath, index],
      })
    }
  })
}

export function indent(editor: Editor) {
  if (!editor.selection) return

  const listItems = getSelectedListItems(editor)
  const subRoots = filterForSubtreeRoots(listItems)
  const refs = subRoots.map(([_, path]) => Editor.pathRef(editor, path))

  refs.forEach(ref => {
    if (ref.current) {
      indentPath(editor, ref.current)
    }
    ref.unref()
  })
}
