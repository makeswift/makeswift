import type { KeyboardEvent } from 'react'
import { cx } from '@emotion/css'
import { Editor, Transforms, Range, Node, PathRef, Text } from 'slate'
import { type RenderElementProps } from 'slate-react'
import { Select, Slate, type DataType } from '@makeswift/controls'

import { setBlockKeyForDevice } from './setBlockKeyForDevice'
import { clearBlockKeyForDevice } from './clearBlockKeyForDevice'
import { wrapInline } from './wrapInline'
import { unwrapInline } from './unwrapInline'
import { getSelection } from '../selectors'
import { ElementUtils } from '../utils/element'
import { getActiveBlockType } from '../selectors'
import { unwrapList } from './unwrapList'
import { wrapList } from './wrapList'
import { indent } from './indent'
import { dedent } from './dedent'
import { toggleList } from './toggleList'
import { EditorUtils } from '../utils/editor'
import isHotkey from 'is-hotkey'
import { LIST_ITEM_CHILD_POSITION } from './constants'
import { useStyle } from '../../runtimes/react/use-style'
import { type RenderElement, Plugin } from '../../controls/rich-text-v2/plugin'
import { BlockType } from '../../slate/types'

export const BlockActions = {
  setBlockKeyForDevice,
  clearBlockKeyForDevice,
  wrapInline,
  unwrapInline,
}

// TODO: This API is still litered with artifacts from the list plugin being seperated out.
// This plugin needs to be rewritten to be assumptionless.
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
    Array.from(Editor.nodes(editor, { match: node => Slate.isListItem(node) })).length === 0
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
      match: node => Slate.isListItem(node),
    })
  }

  if (isHotkey('shift+enter', e)) {
    e.preventDefault()
    editor.insertText('\n')
  }
}

export function withBlock(editor: Editor) {
  const { normalizeNode } = editor

  editor.isInline = entry => {
    return Slate.isInline(entry)
  }

  editor.normalizeNode = entry => {
    const [normalizationNode, normalizationPath] = entry
    // Normalization textAlign with empty array of values
    if (Slate.isBlock(normalizationNode) && normalizationNode?.textAlign?.length == 0) {
      Transforms.unsetNodes(editor, 'textAlign', { at: normalizationPath })
      return
    }

    // Normalization for preventing non-list root blocks from being nested.
    if (
      normalizationPath.length === 1 &&
      Slate.isRootBlock(normalizationNode) &&
      !Slate.isList(normalizationNode)
    ) {
      const children = Array.from(Node.children(editor, normalizationPath))
      if (children.findIndex(([child]) => Slate.isRootBlock(child)) !== -1) {
        Transforms.unwrapNodes(editor, { at: normalizationPath })
        return
      }
    }

    // Normalization for converting children of list items to list item children
    // In the case of backspace from position 0 of node into a list this converts the node into a list item.
    if (Slate.isListItem(normalizationNode)) {
      const pathToListItemText = [...normalizationPath, LIST_ITEM_CHILD_POSITION]

      if (Node.has(editor, pathToListItemText)) {
        const nodeInListItemTextPosition = Node.get(editor, pathToListItemText)
        if (Slate.isRootBlock(nodeInListItemTextPosition)) {
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
            !Slate.isList(potentialNodeToBeMerged[0]) ||
            !Slate.isList(child[0]) ||
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

const definition = Select({
  label: 'Block',
  labelOrientation: 'horizontal',
  options: [
    {
      value: BlockType.Paragraph,
      label: 'Paragraph',
    },
    {
      value: BlockType.Heading1,
      label: 'Heading 1',
    },
    {
      value: BlockType.Heading2,
      label: 'Heading 2',
    },
    {
      value: BlockType.Heading3,
      label: 'Heading 3',
    },
    {
      value: BlockType.Heading4,
      label: 'Heading 4',
    },
    {
      value: BlockType.Heading5,
      label: 'Heading 5',
    },
    {
      value: BlockType.Heading6,
      label: 'Heading 6',
    },
    {
      value: BlockType.UnorderedList,
      label: 'Bulleted list',
    },
    {
      value: BlockType.OrderedList,
      label: 'Numbered list',
    },
    {
      value: BlockType.BlockQuote,
      label: 'Quote',
    },
  ],
  defaultValue: BlockType.Paragraph,
})

export function BlockPlugin() {
  return Plugin({
    withPlugin: withBlock,
    onKeyDown: onKeyDown,
    control: {
      definition,
      onChange: (editor, value: DataType<typeof definition>) => {
        // TODO: This onChange being so complex is an artifact of how the List plugin used to be seperated out from the block plugin.
        // Would be great to refactor and simplify here.

        const activeBlockType = getActiveBlockType(editor)
        if (value === BlockType.UnorderedList || value === BlockType.OrderedList) {
          ListActions.toggleList(editor, {
            type: value,
            at: getSelection(editor),
          })
        } else if (activeBlockType === value) {
          Transforms.setNodes(
            editor,
            {
              type: BlockType.Default,
            },
            { at: getSelection(editor) },
          )
        } else {
          ListActions.unwrapList(editor, {
            at: getSelection(editor),
          })
          Transforms.setNodes(
            editor,
            {
              type: value ?? BlockType.Default,
            },
            { at: getSelection(editor) },
          )
        }
      },
      getValue: editor => {
        const activeBlock = getActiveBlockType(editor)

        if (activeBlock == null) return undefined
        if (activeBlock === Slate.RootBlockType.Default) return undefined

        return activeBlock
      },
    },
    renderElement: renderElement => props => (
      <BlockPluginComponent {...props} renderElement={renderElement} />
    ),
  })
}

function BlockPluginComponent({
  renderElement,
  ...props
}: RenderElementProps & { renderElement: RenderElement }) {
  const blockStyles = [useStyle({ margin: 0 }), props.element.className]
  const quoteStyles = useStyle({
    padding: '0.5em 10px',
    fontSize: '1.25em',
    fontWeight: '300',
    borderLeft: '5px solid rgba(0, 0, 0, 0.1)',
  })

  const unorderedListStyles = useStyle({
    listStylePosition: 'inside',
    paddingInlineStart: '20px',
    listStyleType: 'disc',
    ul: {
      listStyleType: 'circle',
    },
    'ul ul': {
      listStyleType: 'square',
    },
  })

  const orderedListStyles = useStyle({
    listStylePosition: 'inside',
    paddingInlineStart: '20px',
    listStyleType: 'decimal',
  })

  switch (props.element.type) {
    case BlockType.Default:
    case BlockType.Paragraph:
      return (
        <p {...props.attributes} className={cx(...blockStyles)}>
          {renderElement(props)}
        </p>
      )
    case BlockType.Heading1:
      return (
        <h1 {...props.attributes} className={cx(...blockStyles)}>
          {renderElement(props)}
        </h1>
      )
    case BlockType.Heading2:
      return (
        <h2 {...props.attributes} className={cx(...blockStyles)}>
          {renderElement(props)}
        </h2>
      )
    case BlockType.Heading3:
      return (
        <h3 {...props.attributes} className={cx(...blockStyles)}>
          {renderElement(props)}
        </h3>
      )
    case BlockType.Heading4:
      return (
        <h4 {...props.attributes} className={cx(...blockStyles)}>
          {renderElement(props)}
        </h4>
      )
    case BlockType.Heading5:
      return (
        <h5 {...props.attributes} className={cx(...blockStyles)}>
          {renderElement(props)}
        </h5>
      )
    case BlockType.Heading6:
      return (
        <h6 {...props.attributes} className={cx(...blockStyles)}>
          {renderElement(props)}
        </h6>
      )
    case BlockType.BlockQuote:
      return (
        <blockquote {...props.attributes} className={cx(...blockStyles, quoteStyles)}>
          {renderElement(props)}
        </blockquote>
      )
    case BlockType.OrderedList:
      return (
        <ol {...props.attributes} className={cx(...blockStyles, orderedListStyles)}>
          {renderElement(props)}
        </ol>
      )
    case BlockType.UnorderedList:
      return (
        <ul {...props.attributes} className={cx(...blockStyles, unorderedListStyles)}>
          {renderElement(props)}
        </ul>
      )
    case BlockType.ListItem:
      return (
        <li {...props.attributes} className={cx(...blockStyles)}>
          {renderElement(props)}
        </li>
      )
    case BlockType.ListItemChild:
      return (
        <span {...props.attributes} className={cx(...blockStyles)}>
          {renderElement(props)}
        </span>
      )
    default:
      return <>{renderElement(props)}</>
  }
}
