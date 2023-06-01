import { Editor, Text } from 'slate'
import {
  Color,
  createRichTextV2Plugin,
  unstable_StyleV2,
  ColorControlDefinition,
} from '../../controls'
import { ControlDefinitionValue } from '../../runtimes/react/controls/control'
import {
  getResponsiveValue,
  normalizeResponsiveValue,
  setResponsiveValue,
} from '../utils/responsive'

export const COLOR_KEY = 'color'

export function ColorPlugin() {
  return createRichTextV2Plugin({
    control: {
      definition: unstable_StyleV2({
        type: Color({
          label: 'Color',
        }),
        getStyle(color: ControlDefinitionValue<ColorControlDefinition>) {
          return { color }
        },
      }),
      onChange: (editor, value) => {
        setResponsiveValue(editor, COLOR_KEY, value, {
          match: Text.isText,
          split: true,
        })
      },
      getValue: editor => getResponsiveValue(editor, COLOR_KEY, { match: Text.isText }),
      getLeafValue: (text: Text) => {
        return Text.isText(text) ? text?.color : undefined
      },
    },
    withPlugin: (editor: Editor) => {
      const { normalizeNode } = editor
      editor.normalizeNode = entry => {
        if (normalizeResponsiveValue(editor, COLOR_KEY, { match: Text.isText })(entry)) {
          return
        }

        normalizeNode(entry)
      }

      return editor
    },
    renderLeaf: (renderLeaf, className) => props => {
      return renderLeaf({
        ...props,
        leaf: {
          ...props.leaf,
          className,
        },
      })
    },
  })
}
