import { Editor, Element, NodeEntry } from 'slate'
import { unstable_IconRadioGroup, Slate } from '@makeswift/controls'

import { unstable_StyleV2 } from '../../controls/style-v2/style-v2'
import { normalizeResponsiveValue, setResponsiveValue } from '../utils/responsive'
import { getValue } from './getValue'
import { Plugin } from '../../controls/rich-text-v2/plugin'

const TEXT_ALIGN_KEY = 'textAlign'

export const withTextAlign = (editor: Editor) => {
  const { normalizeNode } = editor
  editor.normalizeNode = entry => {
    if (
      normalizeResponsiveValue(editor, TEXT_ALIGN_KEY, { match: Slate.isRootBlock })(
        entry as NodeEntry<Slate.RootBlock>,
      )
    ) {
      return
    }
    normalizeNode(entry)
  }

  return editor
}

export function TextAlignPlugin() {
  return Plugin({
    control: {
      definition: unstable_StyleV2({
        type: unstable_IconRadioGroup({
          label: 'Alignment',
          options: [
            {
              icon: unstable_IconRadioGroup.Icon.TextAlignLeft,
              label: 'Left Align',
              value: 'left',
            },
            {
              icon: unstable_IconRadioGroup.Icon.TextAlignCenter,
              label: 'Center Align',
              value: 'center',
            },
            {
              icon: unstable_IconRadioGroup.Icon.TextAlignRight,
              label: 'Right Align',
              value: 'right',
            },
            {
              icon: unstable_IconRadioGroup.Icon.TextAlignJustify,
              label: 'Justify',
              value: 'justify',
            },
          ],
          defaultValue: 'left',
        }),
        getStyle(textAlign) {
          return { textAlign }
        },
      }),
      onChange: (editor, value) =>
        setResponsiveValue(editor, TEXT_ALIGN_KEY, value, {
          match: Slate.isRootBlock,
          split: false,
        }),
      getValue,
      getElementValue: (element: Element) => {
        return Slate.isRootBlock(element) ? element.textAlign : undefined
      },
    },
    withPlugin: withTextAlign,
    renderElement: (renderElement, className) => props => {
      return renderElement({
        ...props,
        element: {
          ...props.element,
          className,
        },
      })
    },
  })
}
