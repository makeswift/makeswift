import { Editor, Transforms, Text } from 'slate'
import { RichTextTypography } from '../../controls'

export function clearActiveTypographyStyle(editor: Editor) {
  if (!editor.selection) return

  // Due to the nested nature of `typography` I can't just call a single `Transforms.setNodes` on our selection
  const textNodes = Editor.nodes(editor, {
    at: editor.selection,
    match: node => Text.isText(node),
  })

  for (const [node, path] of textNodes) {
    if (Text.isText(node)) {
      const typography: RichTextTypography = {
        ...node.typography,
        style: [],
      }

      Transforms.setNodes(
        editor,
        {
          typography,
        },
        { at: path },
      )
    }
  }
}
