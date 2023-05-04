import { Editor, Transforms, Text, Range } from 'slate'
import { RichTextTypography } from '../../controls'

type ClearDeviceActiveTypographyOptions = {
  at?: Range
}

export function clearDeviceActiveTypography(
  editor: Editor,
  currentDeviceId: string,
  options?: ClearDeviceActiveTypographyOptions,
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
          const typography: RichTextTypography = {
            ...node.typography,
            style:
              node?.typography?.style.filter(({ deviceId }) => deviceId !== currentDeviceId) ?? [],
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

    atRef.unref()
  })
}
