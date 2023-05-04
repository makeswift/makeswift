import { Editor, Transforms, Text, Range } from 'slate'

type SetActiveTypographyIdOptions = {
  at?: Range
}

export function setActiveTypographyId(
  editor: Editor,
  id?: string,
  options?: SetActiveTypographyIdOptions,
) {
  const at = options?.at ?? editor.selection
  if (!at) return
  Transforms.setNodes(
    editor,
    {
      typography: {
        id,
        style: [],
      },
    },
    {
      at,
      match: node => Text.isText(node),
      split: Range.isExpanded(at),
    },
  )
}
