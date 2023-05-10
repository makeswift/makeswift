import type { KeyboardEvent } from 'react'
import { Editor, Transforms, Range, Node, PathRef, Text } from 'slate'
import isHotkey from 'is-hotkey'
import { LIST_ITEM_CHILD_POSITION } from './constants'
import { EditorUtils } from '../utils/editor'
import { ElementUtils } from '../utils/element'
import { dedent } from './dedent'
import { indent } from './indent'
import { toggleList } from './toggleList'
import { unwrapList } from './unwrapList'
import { wrapList } from './wrapList'
import { BlockType } from '../types'

export const ListActions = {
  unwrapList,
  wrapList,
  indent,
  dedent,
  toggleList,
}

export function onKeyDown(e: KeyboardEvent, editor: Editor) {
  if (
    !editor.selection ||
    Array.from(Editor.nodes(editor, { match: node => ElementUtils.isListItem(node) })).length === 0
  )
    return

  if (isHotkey('shift+tab', e)) {
    e.preventDefault()
    ListActions.dedent(editor)
  }

  if (isHotkey('tab', e)) {
    e.preventDefault()
    ListActions.indent(editor)
  }

  if (isHotkey('backspace', e)) {
    if (!editor.selection) return
    if (Range.isExpanded(editor.selection)) return
    const listItem = EditorUtils.getFirstAncestorListItem(editor, editor.selection.anchor.path)
    if (editor.selection.anchor.offset === 0 && listItem) {
      e.preventDefault()
      const parentListItem = EditorUtils.getFirstAncestorListItem(editor, listItem[1])
      const list = EditorUtils.getFirstAncestorList(editor, listItem[1])

      if (parentListItem) {
        ListActions.dedent(editor)
      } else if (list) {
        ListActions.unwrapList(editor)
      }
      return
    }
  }

  if (isHotkey('enter', e)) {
    e.preventDefault()

    if (!editor.selection) return

    if (Range.isExpanded(editor.selection)) {
      Transforms.delete(editor)
      return
    }

    const listItem = EditorUtils.getFirstAncestorListItem(editor, editor.selection.anchor.path)
    if (
      editor.selection.anchor.offset === 0 &&
      listItem &&
      Editor.string(editor, listItem[1]) === ''
    ) {
      const parentListItem = EditorUtils.getFirstAncestorListItem(editor, listItem[1])

      if (parentListItem) {
        ListActions.dedent(editor)
      } else {
        ListActions.unwrapList(editor)
      }
      return
    }

    Transforms.splitNodes(editor, {
      at: editor.selection,
      always: true,
      match: node => ElementUtils.isListItem(node),
    })
  }

  if (isHotkey('shift+enter', e)) {
    e.preventDefault()
    editor.insertText('\n')
  }
}

export function withList(editor: Editor) {
  const { normalizeNode } = editor
  editor.normalizeNode = entry => {
    const [normalizationNode, normalizationPath] = entry

    // Normalization for converting children of list items to list item children
    // In the case of backspace from position 0 of node into a list this converts the node into a list item.
    if (ElementUtils.isListItem(normalizationNode)) {
      const pathToListItemText = [...normalizationPath, LIST_ITEM_CHILD_POSITION]

      if (Node.has(editor, pathToListItemText)) {
        const nodeInListItemTextPosition = Node.get(editor, pathToListItemText)
        if (ElementUtils.isParagraph(nodeInListItemTextPosition)) {
          Transforms.setNodes(
            editor,
            { type: BlockType.ListItemChild },
            {
              at: pathToListItemText,
            },
          )
          return
        }
      } else {
        Transforms.insertNodes(editor, ElementUtils.createListItem(), {
          at: pathToListItemText,
        })
        return
      }
    }

    // Normalization for merging adjacent lists of the same type
    if (!Text.isText(normalizationNode)) {
      const mergeableChildren = Array.from(Node.children(editor, normalizationPath))
        .map((child, index, children) => {
          const potentialNodeToBeMerged = children.at(index + 1)
          if (
            !potentialNodeToBeMerged ||
            !ElementUtils.isList(potentialNodeToBeMerged[0]) ||
            !ElementUtils.isList(child[0]) ||
            potentialNodeToBeMerged[0].type !== child[0].type
          ) {
            return null
          }
          return [
            Editor.pathRef(editor, child[1]),
            Editor.pathRef(editor, potentialNodeToBeMerged[1]),
          ]
        })
        .filter((mergeableNodes): mergeableNodes is PathRef[] => Boolean(mergeableNodes))

      if (mergeableChildren.length !== 0) {
        mergeableChildren.reverse().forEach(([nodePathRef, nodeToBeMergedPathRef]) => {
          const nodePath = nodePathRef.current
          const nodeToBeMergedPath = nodeToBeMergedPathRef.current
          if (nodePath == null || nodeToBeMergedPath == null) return
          const nodeChildren = Array.from(Node.children(editor, nodePath))
          const childrenToBeMerged = Array.from(Node.children(editor, nodeToBeMergedPath))
          Editor.withoutNormalizing(editor, () => {
            childrenToBeMerged.reverse().forEach(([_, childPath]) => {
              Transforms.moveNodes(editor, {
                at: childPath,
                to: [...nodePath, nodeChildren.length],
              })
            })
            Transforms.removeNodes(editor, { at: nodeToBeMergedPath })
          })
          nodePathRef.unref()
          nodeToBeMergedPathRef.unref()
        })
        return
      }
    }

    normalizeNode(entry)
  }

  return editor
}
