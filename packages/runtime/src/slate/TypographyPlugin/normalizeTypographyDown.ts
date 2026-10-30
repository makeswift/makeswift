import { Editor, Element, NodeEntry, Transforms } from 'slate'
import { shallowMerge } from '@makeswift/controls'

import { MakeswiftEditor } from '../types'
import { TYPOGRAPHY_KEY } from '.'
import { type TypographyValue, toTypographyData, toTypographyValue } from './typography-value'

export function shallowMergeTypographies(
  commonTypography?: TypographyValue,
  typography?: TypographyValue,
): TypographyValue {
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
          toTypographyValue(normalizationNode.typography),
          toTypographyValue(normalizationNode.children.at(i)?.typography),
        )
        Transforms.setNodes(
          editor,
          { typography: toTypographyData(resultingTypography) },
          { at: [...normalizationPath, i] },
        )
      }
    })
    return true
  }

  return false
}
