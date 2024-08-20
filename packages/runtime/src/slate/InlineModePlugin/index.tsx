import { type KeyboardEvent } from 'react'
import { type Editor, Path, Text, Transforms } from 'slate'
import { type RenderElementProps } from 'slate-react'
import isHotkey from 'is-hotkey'

import { Slate } from '@makeswift/controls'

import { type RenderElement, Plugin } from '../../controls/rich-text-v2/plugin'

const BLOCK_ONE_PATH = [0]
const BLOCK_TWO_PATH = [1]

export function withInlineMode(editor: Editor): Editor {
  const { normalizeNode } = editor
  editor.normalizeNode = entry => {
    const [normalizationNode, normalizationPath] = entry

    /**
     * Merge root nodes past the first one
     */
    if (Path.equals(BLOCK_TWO_PATH, normalizationPath)) {
      Transforms.mergeNodes(editor, { at: BLOCK_TWO_PATH })
      return
    }
    /**
     * Unwrap non text nodes of first root node
     */
    if (Path.isAncestor(BLOCK_ONE_PATH, normalizationPath) && Slate.isBlock(normalizationNode)) {
      Transforms.unwrapNodes(editor, {
        at: normalizationPath,
      })
      return
    }
    /**
     * Update type of root nodes to be `text-block`
     */
    if (Path.equals(BLOCK_ONE_PATH, normalizationPath)) {
      Transforms.setNodes(editor, { type: Slate.BlockType.Default }, { at: normalizationPath })
      return
    }

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
