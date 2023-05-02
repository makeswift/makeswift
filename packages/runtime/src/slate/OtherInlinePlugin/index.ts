import { Editor, Transforms } from 'slate'
import { RichTextV2Plugin, Select } from '../../controls'
import { ElementUtils } from '../utils/element'
import { Block } from '../BlockPlugin'

export const OtherInline: RichTextV2Plugin<any> = {
  controls: [
    {
      definition: Select({
        label: 'Inline',
        options: [
          {
            value: 'code',
            label: 'Code',
          },
          {
            value: 'superscript',
            label: 'Super',
          },
        ],
      }),
      onChange: (editor, value) => {
        Block.wrapInline(editor, {
          type: value,
          children: [],
        })
      },
      getValue: editor => {
        return Block.getInlinesInSelection(editor)
          .map(inline => inline[0].type)
          .at(0)
      },
    },
  ],
  withPlugin: withOtherInlinePlugin,
}

export function withOtherInlinePlugin(editor: Editor) {
  const { normalizeNode } = editor

  editor.isInline = entry => {
    return ElementUtils.isInline(entry)
  }

  editor.normalizeNode = entry => {
    const [normalizationNode, normalizationPath] = entry
    // Normalization textAlign with empty array of values
    if (ElementUtils.isBlock(normalizationNode) && normalizationNode?.textAlign?.length == 0) {
      Transforms.unsetNodes(editor, 'textAlign', { at: normalizationPath })
      return
    }

    normalizeNode(entry)
  }

  return editor
}
