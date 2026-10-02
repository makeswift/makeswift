import { type KeyboardEvent } from 'react'
import { type Editor, type NodeEntry, Path, Text, Transforms } from 'slate'
import { type RenderElementProps } from 'slate-react'
import isHotkey from 'is-hotkey'

import { Slate } from '@makeswift/controls'

import { type RenderElement, Plugin } from '../../controls/rich-text-v2/plugin'

const BLOCK_ONE_PATH = [0]
const BLOCK_TWO_PATH = [1]

/**
 * The inline mode rules: one root block of the default type, with no nested
 * blocks. Returns `true` if it changed the tree, as `normalizeNode` expects.
 */
export function normalizeInlineMode(editor: Editor, [node, path]: NodeEntry): boolean {
  /**
   * Merge root nodes past the first one
   */
  if (Path.equals(BLOCK_TWO_PATH, path)) {
    Transforms.mergeNodes(editor, { at: BLOCK_TWO_PATH })
    return true
  }
  /**
   * Unwrap non text nodes of first root node
   */
  if (Path.isAncestor(BLOCK_ONE_PATH, path) && Slate.isBlock(node)) {
    Transforms.unwrapNodes(editor, { at: path })
    return true
  }
  /**
   * Update type of root nodes to be `text-block`
   */
  if (Path.equals(BLOCK_ONE_PATH, path)) {
    Transforms.setNodes(editor, { type: Slate.BlockType.Default }, { at: path })
    return true
  }

  return false
}

export function withInlineMode(editor: Editor): Editor {
  const { normalizeNode } = editor
  editor.normalizeNode = entry => {
    if (normalizeInlineMode(editor, entry)) return

    normalizeNode(entry)
  }

  return editor
}

export function InlineModePlugin() {
  return Plugin({
    onKeyDown: (e: KeyboardEvent) => {
      if (isHotkey('enter', e)) e.preventDefault()
    },
    withPlugin: withInlineMode,
    renderElement: renderElement => props => (
      <InlineModePluginComponent {...props} renderElement={renderElement} />
    ),
  })
}

const minWidth = `${'Write some text...'.length}ch`

function InlineModePluginComponent({
  renderElement,
  ...props
}: RenderElementProps & { renderElement: RenderElement }) {
  if (props.element.children.length === 1) {
    const text = props.element.children[0]

    if (Text.isText(text) && text.text === '') {
      return (
        <span style={{ display: 'inline-block', minWidth }} {...props.attributes}>
          {renderElement(props)}
        </span>
      )
    }
  }

  return (
    <span style={{ minWidth }} {...props.attributes}>
      {renderElement(props)}
    </span>
  )
}
