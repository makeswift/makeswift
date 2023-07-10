import { Editor, Path, Transforms } from 'slate'
import { KeyboardEvent } from 'react'
import isHotkey from 'is-hotkey'
import { createRichTextV2Plugin } from '../../controls/rich-text-v2'
import { ElementUtils } from '../utils/element'
import { BlockType } from '../types'

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
    if (
      Path.isAncestor(BLOCK_ONE_PATH, normalizationPath) &&
      ElementUtils.isBlock(normalizationNode)
    ) {
      Transforms.unwrapNodes(editor, {
        at: normalizationPath,
      })
      return
    }
    /**
     * Update type of root nodes to be `text-block`
     */
    if (Path.equals(BLOCK_ONE_PATH, normalizationPath)) {
      Transforms.setNodes(editor, { type: BlockType.Text }, { at: normalizationPath })
      return
    }

    normalizeNode(entry)
  }

  return editor
}

export function InlineModePlugin() {
  return createRichTextV2Plugin({
    onKeyDown: (e: KeyboardEvent) => {
      if (isHotkey('enter', e)) e.preventDefault()
    },
    withPlugin: withInlineMode,
  })
}
