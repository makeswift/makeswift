import { Editor, Transforms, Text } from 'slate'
import { isDeviceOverride } from '../../components/builtin/Text/components/Leaf'
import { findDeviceOverride } from '../../components/utils/devices'
import { RichTextTypography } from '../../controls'

export function setActiveTypographyStyle(
  editor: Editor,
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
      const deviceOverrides = node?.typography?.style.filter(isDeviceOverride) ?? []
      const deviceStyle = findDeviceOverride(deviceOverrides, deviceId, v => v) || { value: {} }
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
