import { Editor, Transforms, Text } from 'slate'

export function setActiveTypographyId(editor: Editor, id: string) {
  Transforms.setNodes(
    editor,
    {
      typography: {
        id,
        style: [],
      },
    },
    {
      match: node => Text.isText(node),
    },
  )
}
