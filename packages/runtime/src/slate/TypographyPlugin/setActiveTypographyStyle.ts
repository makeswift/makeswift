import { Editor, Transforms, Text, Range } from 'slate'
import { isDeviceOverride } from '../../components/builtin/Text/components/Leaf'
import { findDeviceOverride } from '../../components/utils/devices'
import { RichTextTypography } from '../../controls'
import pkg from 'slate/package.json'

export function setActiveTypographyStyle(
  editor: Editor,
  deviceId: string,
  prop: string,
  value?: unknown,
) {
  Editor.withoutNormalizing(editor, () => {
    console.log(pkg.version)

    console.log('3')
    if (!editor.selection) return
    Transforms.setNodes(
      editor,
      {
        slice: true,
      },
      {
        at: editor.selection,
        match: node => Text.isText(node),
        split: Range.isExpanded(editor.selection),
        hanging: false,
      },
    )

    const textNodes = Array.from(
      Editor.nodes(editor, {
        at: editor.selection,
        match: node => Text.isText(node) && node.slice === true,
      }),
    )
    console.log(JSON.stringify(textNodes), JSON.stringify(editor.children))

    for (const [node, path] of textNodes) {
      console.log('hit', path)
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
    console.log('2', JSON.stringify(editor.children))
  })
}
