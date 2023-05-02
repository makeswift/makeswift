import { Editor, Transforms } from 'slate'
import { Device } from '../../controls/types'
import { ElementUtils } from '../utils/element'
import { EditableBlockKey } from './types'

export function clearBlockKeyForDevice(editor: Editor, deviceId: Device, key: EditableBlockKey) {
  if (!editor.selection) return

  const rootElements = Editor.nodes(editor, {
    match: (_, path) => path.length === 1,
    at: Editor.unhangRange(editor, editor.selection),
  })

  for (const [node, path] of rootElements) {
    if (ElementUtils.isBlock(node)) {
      const deviceOverrides = node?.[key] ?? []
      Transforms.setNodes(
        editor,
        {
          [key]: deviceOverrides.filter(v => v.deviceId !== deviceId),
        },
        { at: path },
      )
    }
  }
}
