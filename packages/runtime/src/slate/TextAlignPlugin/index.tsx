import { Editor, Element, NodeEntry } from 'slate'
import {
  createRichTextV2Plugin,
  unstable_IconRadioGroup,
  unstable_IconRadioGroupIcon,
  unstable_StyleV2,
} from '../../controls'
import { ElementUtils } from '../utils/element'
import { normalizeResponsiveValue, setResponsiveValue } from '../utils/responsive'
import { getValue } from './getValue'
import { RootBlock } from '../types'

const TEXT_ALIGN_KEY = 'textAlign'

export const withTextAlign = (editor: Editor) => {
  const { normalizeNode } = editor
  editor.normalizeNode = entry => {
    if (
      normalizeResponsiveValue(editor, TEXT_ALIGN_KEY, { match: ElementUtils.isRootBlock })(
        entry as NodeEntry<RootBlock>,
      )
    ) {
      return
    }
    normalizeNode(entry)
  }

  return editor
}

export function TextAlignPlugin() {
  return createRichTextV2Plugin({
    control: {
      definition: unstable_StyleV2({
        type: unstable_IconRadioGroup({
          label: 'Alignment',
          options: [
            {
              icon: unstable_IconRadioGroupIcon.TextAlignLeft,
              label: 'Left Align',
              value: 'left',
            },
            {
              icon: unstable_IconRadioGroupIcon.TextAlignCenter,
              label: 'Center Align',
              value: 'center',
            },
            {
              icon: unstable_IconRadioGroupIcon.TextAlignRight,
              label: 'Right Align',
              value: 'right',
            },
            {
              icon: unstable_IconRadioGroupIcon.TextAlignJustify,
              label: 'Justify',
              value: 'justify',
            },
          ],
          defaultValue: 'left',
        }),
        getStyle(textAlign: 'left' | 'center' | 'right' | 'justify' | undefined) {
          return { textAlign }
        },
      }),
      onChange: (editor, value) =>
        setResponsiveValue(editor, TEXT_ALIGN_KEY, value, {
          match: ElementUtils.isRootBlock,
          split: false,
        }),
      getValue: editor => getValue(editor),
      getElementValue: (element: Element) => {
        return ElementUtils.isRootBlock(element) ? element.textAlign : undefined
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
