import { Editor, Node, Transforms } from 'slate'
import { RichTextV2Plugin } from '../../controls'
import { KeyboardEvent } from 'react'
import isHotkey from 'is-hotkey'

export const Inline: RichTextV2Plugin<any> = {
  editableProps: {
    onKeyDown: (e: KeyboardEvent) => {
      if (isHotkey('enter', e)) e.preventDefault()
    },
  },
  withPlugin: withInline,
}

const BLOCK_TWO_PATH = [1]
export function withInline(editor: Editor) {
  const { normalizeNode } = editor

  editor.normalizeNode = entry => {
    if (Node.has(editor, BLOCK_TWO_PATH)) {
      Transforms.removeNodes(editor, { at: BLOCK_TWO_PATH })
      return
    }


    // normalize position 1 to be "Text"

    // normalize nest blocks to unwrap and just be inline or text

    normalizeNode(entry)
  }

  return editor
}

