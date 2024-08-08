import { Editor, Transforms, Text, Range } from 'slate'
import { RichTextTypography } from '@makeswift/controls'

type SetActiveTypographyIdOptions = {
  at?: Range
}

export function detachActiveTypography(
  editor: Editor,
  value: RichTextTypography['style'],
  options?: SetActiveTypographyIdOptions,
) {
  Editor.withoutNormalizing(editor, () => {
    const at = options?.at ?? editor.selection
    if (!at) return
    const atRef = Editor.rangeRef(editor, at)

    if (atRef.current) {
      Transforms.setNodes(
        editor,
        {
          slice: true,
        },
        {
          at: atRef.current,
          match: node => Text.isText(node),
          split: Range.isExpanded(atRef.current),
        },
      )
    }

    if (atRef.current) {
      const textNodes = Array.from(
        Editor.nodes(editor, {
          at: atRef.current,
          match: node => Text.isText(node) && node.slice === true,
        }),
      )

      for (const [node, path] of textNodes) {
        if (Text.isText(node)) {
          Transforms.setNodes(
            editor,
            {
              typography: {
                style: value,
              },
            },
            { at: path },
          )
        }
      }
    }

    atRef.unref()
  })
}
