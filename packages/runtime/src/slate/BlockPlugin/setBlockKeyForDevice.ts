import { Editor, Transforms, Location } from 'slate'
import { getBlocksInSelection } from '../selectors'
import { ElementUtils } from '../utils/element'
import { EditableBlockKey, EditableBlockValue } from './types'
import { Breakpoints, BreakpointId, findBreakpointOverride } from '../../state/modules/breakpoints'

type SetBlockKeyForDeviceOptions = {
  at?: Location
}

export function setBlockKeyForDevice(
  editor: Editor,
  breakpoints: Breakpoints,
  deviceId: BreakpointId,
  key: EditableBlockKey,
  value: EditableBlockValue[number]['value'],
  options?: SetBlockKeyForDeviceOptions,
) {
  const at = options?.at ?? editor.selection
  if (!at) return

  const rootElements = getBlocksInSelection(editor)

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
