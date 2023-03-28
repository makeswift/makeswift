import { Editor, Transforms, Text } from 'slate'
import { RichTextTypography } from '../../controls'

export function detachActiveTypography(editor: Editor, value: RichTextTypography['style']) {
  if (!editor.selection) return

  const textNodes = Array.from(
    Editor.nodes(editor, {
      at: editor.selection,
      match: node => Text.isText(node),
    }),
  )

  textNodes.forEach(([node, path]) => {
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
  })
}
