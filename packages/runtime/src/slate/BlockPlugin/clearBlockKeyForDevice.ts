import { Editor, Transforms } from 'slate'
import { Slate } from '@makeswift/controls'

import { EditableBlockKey } from './types'
import { getBlocksInSelection } from '../selectors'
import { BreakpointId } from '../../state/modules/breakpoints'

export function clearBlockKeyForDevice(
  editor: Editor,
  deviceId: BreakpointId,
  key: EditableBlockKey,
) {
  const rootElements = getBlocksInSelection(editor)

  for (const [node, path] of rootElements) {
    if (Slate.isBlock(node)) {
      const deviceOverrides = node[key] ?? []
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
