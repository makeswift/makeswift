import { BaseEditor, Descendant, Editor, Transforms, Text, Node } from 'slate'
import { ReactEditor } from 'slate-react'
import { Slate } from '@makeswift/controls'

export interface BuilderEditor extends BaseEditor {
  focusAndSelectAll: () => void
  deselectAndBlur: () => void
  resetValue: (value: Descendant[]) => void
}

export function withBuilder(editor: Editor) {
  editor.resetValue = function (value: Descendant[]) {
    const firstRootBlock = Node.has(editor, [0]) && Node.get(editor, [0])
    const textAlignOfFirstBlock =
      firstRootBlock && Slate.isRootBlock(firstRootBlock) ? firstRootBlock.textAlign : undefined
    const typographyOfFirstText = Array.from(Node.texts(editor)).at(0)?.[0].typography

    ReactEditor.deselect(editor)
    ReactEditor.blur(editor)

    editor.children = value
    editor.onChange()

    if (typographyOfFirstText) {
      Transforms.setNodes(
        editor,
        { typography: typographyOfFirstText },
        {
          match: Text.isText,
          at: {
            anchor: Editor.start(editor, []),
            focus: Editor.end(editor, []),
          },
        },
      )
    }
    if (textAlignOfFirstBlock) {
      Transforms.setNodes(
        editor,
        { textAlign: textAlignOfFirstBlock },
        {
          match: Slate.isRootBlock,
          at: {
            anchor: Editor.start(editor, []),
            focus: Editor.end(editor, []),
          },
        },
      )
    }
  }
  editor.deselectAndBlur = function () {
    ReactEditor.deselect(editor)
    ReactEditor.blur(editor)
  }

  editor.focusAndSelectAll = function () {
    ReactEditor.focus(editor)
    Transforms.select(editor, {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    })
  }

  return editor
}
