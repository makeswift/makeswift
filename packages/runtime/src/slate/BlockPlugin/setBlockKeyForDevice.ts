import { Editor, Transforms } from 'slate'
import { Device } from '../../controls/types'
import { Breakpoints, findBreakpointOverride } from '../../state/modules/breakpoints'
import { ElementUtils } from '../utils/element'
import { EditableBlockKey, EditableBlockValue } from './types'

export function setBlockKeyForDevice(
  editor: Editor,
  breakpoints: Breakpoints,
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
      const currentDeviceValue = findBreakpointOverride(breakpoints, deviceValues, deviceId, v => v)
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
