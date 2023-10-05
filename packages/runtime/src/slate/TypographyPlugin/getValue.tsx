import { Editor, Text, Node } from 'slate'
import { RichTextTypography } from '../types'
import { getSelection } from '../selectors'
import shallowMerge from '../../utils/shallowMerge'

export function mergeTypographies(
  commonTypography: RichTextTypography,
  typography: RichTextTypography,
) {
  const devices = [
    ...new Set(
      commonTypography.style
        .map(node => node.deviceId)
        .concat(typography?.style.map(node => node.deviceId) ?? []),
    ),
  ]

  const rootTypography: RichTextTypography = {
    id: commonTypography.id ?? typography?.id,
    style: devices.map(deviceId => {
      const commonDevice = commonTypography.style.find(s => s.deviceId === deviceId)
      const existingDeviceStyle = typography?.style.find(s => s.deviceId === deviceId)

      return {
        deviceId,
        value: shallowMerge(commonDevice?.value ?? {}, existingDeviceStyle?.value ?? {}),
      }
    }),
  }
  return rootTypography
}

export function getValue(editor: Editor) {
  console.log('getValue')

  const matchingValues = Array.from(
    Editor.nodes(editor, {
      at: getSelection(editor),
      match: Text.isText,
    }),
  )
    // .map(([node]) => node['typography'] as RichTextTypography | undefined)
    .map(([node, path], index) => {
      const pathCopy = [...path]

      const typographies: RichTextTypography[] = node.typography ? [node.typography] : []
      while (pathCopy.length > 0) {
        pathCopy.pop()

        const parent = Node.get(editor, pathCopy)
        if ('typography' in parent && parent.typography != null) {
          typographies.push(parent.typography)
        }
      }

      const firstTypography = typographies.at(0)

      if (firstTypography == null) return undefined

      return typographies.reduce((acc, curr) => mergeTypographies(acc, curr), firstTypography)
    })

  return matchingValues
}
