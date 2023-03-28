import { Editor, Transforms, Text } from 'slate'
import { RichTextTypography } from '../../controls'

export function clearDeviceActiveTypography(editor: Editor, currentDeviceId: string) {
  if (!editor.selection) return

  const textNodes = Editor.nodes(editor, {
    at: editor.selection,
    match: node => Text.isText(node),
  })

  for (const [node, path] of textNodes) {
    if (Text.isText(node)) {
      const typography: RichTextTypography = {
        ...node.typography,
        style: node?.typography?.style.filter(({ deviceId }) => deviceId !== currentDeviceId) ?? [],
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
