import { Editor, Transforms, Text } from 'slate'
import { RichTextTypography } from '../../controls'
import { Breakpoints, findBreakpointOverride } from '../../state/modules/breakpoints'

export function setActiveTypographyStyle(
  editor: Editor,
  breakpoints: Breakpoints,
  deviceId: string,
  prop: string,
  value?: unknown,
) {
  if (!editor.selection) return

  const textNodes = Editor.nodes(editor, {
    at: editor.selection,
    match: node => Text.isText(node),
  })

  for (const [node, path] of textNodes) {
    if (Text.isText(node)) {
      const deviceOverrides = node?.typography?.style ?? []
      const deviceStyle = findBreakpointOverride(
        breakpoints,
        deviceOverrides,
        deviceId,
        v => v,
      ) || { value: {} }
      const nextDeviceStyle = {
        deviceId,
        value: { ...deviceStyle.value, [prop]: value },
      }
      const nextTypography: RichTextTypography = {
        ...node.typography,
        style: [...deviceOverrides.filter(v => v.deviceId !== deviceId), nextDeviceStyle],
      }

      Transforms.setNodes(
        editor,
        {
          typography: nextTypography,
        },
        { at: path },
      )
    }
  }
}
