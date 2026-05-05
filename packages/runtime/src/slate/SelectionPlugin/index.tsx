import { type Editor } from 'slate'
import { Group, Number } from '@makeswift/controls'

import { Plugin } from '../../controls/rich-text-v2/plugin'

export const definition = Group({
  label: '#selection',
  props: {
    top: Number({ label: 'top' }),
    left: Number({ label: 'left' }),
    bottom: Number({ label: 'bottom' }),
    right: Number({ label: 'right' }),
  },
})

export function SelectionPlugin() {
  return Plugin({
    control: {
      definition,
      getValue: (editor: Editor) =>
        editor.getSelectionBoundingRect() ?? {
          top: undefined,
          left: undefined,
          bottom: undefined,
          right: undefined,
        },
    },
  })
}
