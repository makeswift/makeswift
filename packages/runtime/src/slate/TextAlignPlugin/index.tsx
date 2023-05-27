import { Element, Transforms } from 'slate'
import {
  ControlDefinitionData,
  Select,
  createRichTextV2Plugin,
  unstable_StyleV2,
} from '../../controls'
import { getBlocksInSelection } from '../selectors'
import deepEqual from '../../utils/deepEqual'
import { ElementUtils } from '../utils/element'

const textAlignDefinition = Select({
  options: [
    {
      label: 'Left',
      value: 'left',
    },
    {
      label: 'Center',
      value: 'center',
    },
    {
      label: 'Right',
      value: 'right',
    },
  ],
  defaultValue: 'left',
})

export const definitionWithObject = unstable_StyleV2({
  type: textAlignDefinition,
  getStyle(textAlign: ControlDefinitionData<typeof textAlignDefinition>) {
    return { textAlign }
  },
})

export function TextAlignPlugin() {
  return createRichTextV2Plugin({
    control: {
      definition: definitionWithObject,
      onChange: (editor, value) => {
        const rootElements = getBlocksInSelection(editor)

        for (const [node, path] of rootElements) {
          if (ElementUtils.isBlock(node)) {
            Transforms.setNodes(
              editor,
              {
                ['textAlign']: value,
              },
              { at: path },
            )
          }
        }
      },
      getValue: editor => {
        const blocks = getBlocksInSelection(editor).map(([block]) => {
          return block.textAlign
        })

        const value =
          blocks.length === 0
            ? undefined
            : blocks.reduce((a, b) => (deepEqual(a, b) ? b : undefined))

        return value
      },
      getElementValue: (element: Element) => {
        return ElementUtils.isRootBlock(element) ? element.textAlign : undefined
      },
    },
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
