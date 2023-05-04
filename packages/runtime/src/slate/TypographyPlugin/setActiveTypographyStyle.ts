import { Editor, Transforms, Text, Range } from 'slate'
import { RichTextTypography } from '../../controls'
import { Breakpoints, findBreakpointOverride, BreakpointId } from '../../state/modules/breakpoints'

type SetActiveTypographyStyleOptions = {
  at?: Range
}

export function setActiveTypographyStyle(
  editor: Editor,
  breakpoints: Breakpoints,
  deviceId: string,
  prop: string,
  value?: unknown,
  options?: SetActiveTypographyStyleOptions,
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
          const deviceOverrides = node?.typography?.style ?? []
          const deviceStyle = findBreakpointOverride(
            breakpoints,
            deviceOverrides,
            deviceId as BreakpointId,
            v => v,
          ) || {
            value: {},
          }
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

    atRef.unref()
  })
}
