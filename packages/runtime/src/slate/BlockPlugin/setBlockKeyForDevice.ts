import { Editor, Transforms } from 'slate'
import { findDeviceOverride } from '../../components/utils/devices'
import { Device } from '../../controls/types'
import { ElementUtils } from '../utils/element'
import { EditableBlockKey, EditableBlockValue } from './types'

export function setBlockKeyForDevice(
  editor: Editor,
  deviceId: Device,
  key: EditableBlockKey,
  value: EditableBlockValue,
) {
  if (!editor.selection) return

  const rootElements = Editor.nodes(editor, {
    match: (_, path) => path.length === 1,
    at: Editor.unhangRange(editor, editor.selection),
  })

  for (const [node, path] of rootElements) {
    if (ElementUtils.isBlock(node)) {
      const deviceValues = node[key] ?? []
      const currentDeviceValue = findDeviceOverride(deviceValues, deviceId, v => v)
      const nextDeviceValue = {
        ...currentDeviceValue,
        deviceId,
        value,
      }
      Transforms.setNodes(
        editor,
        {
          [key]: [...deviceValues.filter(v => v.deviceId !== deviceId), nextDeviceValue],
        },
        { at: path },
      )
    }
  }
}
