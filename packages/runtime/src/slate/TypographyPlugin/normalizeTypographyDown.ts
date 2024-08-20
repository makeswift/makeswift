import { Editor, Element, NodeEntry, Transforms } from 'slate'
import { RichTextTypography } from '@makeswift/controls'

import { MakeswiftEditor } from '../types'
import shallowMerge from '../../utils/shallowMerge'
import { TYPOGRAPHY_KEY } from '.'

export function shallowMergeTypographies(
  commonTypography?: RichTextTypography,
  typography?: RichTextTypography,
) {
  const devices = [
    ...new Set(
      commonTypography?.style
        .map(node => node.deviceId)
        .concat(typography?.style.map(node => node.deviceId) ?? []),
    ),
  ]

  return {
    id: commonTypography?.id ?? typography?.id,
    style: devices.map(deviceId => {
      const commonDevice = commonTypography?.style.find(s => s.deviceId === deviceId)
      const existingDeviceStyle = typography?.style.find(s => s.deviceId === deviceId)

      return {
        deviceId,
        value: shallowMerge(existingDeviceStyle?.value ?? {}, commonDevice?.value ?? {}),
      }
    }),
  }
}

export function normalizeTypographyDown(editor: MakeswiftEditor, entry: NodeEntry): boolean {
  const [normalizationNode, normalizationPath] = entry

  if (
    Element.isElement(normalizationNode) &&
    normalizationNode.typography != null &&
    normalizationNode.children.length
  ) {
    Editor.withoutNormalizing(editor, () => {
      Transforms.unsetNodes(editor, TYPOGRAPHY_KEY, { at: normalizationPath })
      for (let i = 0; i < normalizationNode.children.length; i++) {
        const resultingTypography = shallowMergeTypographies(
          normalizationNode.typography,
          normalizationNode.children.at(i)?.typography,
        )
        Transforms.setNodes(
          editor,
          { typography: resultingTypography },
          { at: [...normalizationPath, i] },
        )
      }
    })
    return true
  }

  return false
}
