import { type Editor } from 'slate'
import { GroupDefinition, Group, List, Checkbox, Number, type ValueType } from '@makeswift/controls'

import { type RichTextV2Plugin, Plugin } from '../../controls/rich-text-v2/plugin'

const Rect = () =>
  Group({
    props: {
      x: Number({ label: 'x', defaultValue: 0 }),
      y: Number({ label: 'y', defaultValue: 0 }),
      width: Number({ label: 'width', defaultValue: 0 }),
      height: Number({ label: 'height', defaultValue: 0 }),
    },
  })

export const definition = Group({
  label: '#selection',
  props: {
    selectionInProgress: Checkbox({ defaultValue: false }),
    selectionRects: List({ type: Rect() }),
  },
})

export type SelectionPluginValue = ValueType<typeof definition>

export function SelectionPlugin() {
  return Plugin({
    control: {
      definition,
      getValue: (editor: Editor) => ({
        selectionInProgress: editor.selectionInProgress,
        selectionRects: editor.getSelectionRects() ?? [],
      }),
    },
  })
}

export function isSelectionPlugin({ control }: RichTextV2Plugin) {
  const def = control?.definition
  return (
    def != null &&
    def.controlType === GroupDefinition.type &&
    (def as GroupDefinition).config.label === definition.config.label
  )
}
