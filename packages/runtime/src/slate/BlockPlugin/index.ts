import { Editor, Transforms } from 'slate'
import { setBlockKeyForDevice } from './setBlockKeyForDevice'
import { clearBlockKeyForDevice } from './clearBlockKeyForDevice'
import { wrapInline } from './wrapInline'
import { unwrapInline } from './unwrapInline'
import { getSelection } from '../selectors'
import { ElementUtils } from '../utils/element'
import { Select, createRichTextV2Plugin } from '../../controls'
import { getActiveBlockType } from '../selectors'
import { BlockType, RootBlockType } from '../types'

export const BlockActions = {
  setBlockKeyForDevice,
  clearBlockKeyForDevice,
  wrapInline,
  unwrapInline,
}

export function withBlock(editor: Editor) {
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

export function BlockPlugin() {
  return createRichTextV2Plugin({
    withPlugin: withBlock,
    control: {
      definition: Select({
        label: 'Block',
        options: [
          {
            value: BlockType.Heading1,
            label: 'Heading1',
          },
          {
            value: BlockType.Heading2,
            label: 'Heading2',
          },
          {
            value: BlockType.Heading3,
            label: 'Heading3',
          },
          {
            value: BlockType.Heading4,
            label: 'Heading4',
          },
          {
            value: BlockType.Heading5,
            label: 'Heading5',
          },
          {
            value: BlockType.Heading6,
            label: 'Heading6',
          },
          {
            value: BlockType.Paragraph,
            label: 'Paragraph',
          },
        ],
        defaultValue: BlockType.Paragraph,
      }),
      onChange: (editor, value) => {
        Transforms.setNodes(
          editor,
          {
            type: value ?? BlockType.Default,
          },
          { at: getSelection(editor) },
        )
      },
      getValue: editor => {
        const activeBlock = getActiveBlockType(editor)

        // todo: these types are unhandled in for this mid milestone checkin
        if (
          activeBlock === RootBlockType.BlockQuote ||
          activeBlock === RootBlockType.OrderedList ||
          activeBlock === RootBlockType.UnorderedList ||
          activeBlock === RootBlockType.Text ||
          activeBlock === RootBlockType.Default
        )
          return undefined

        return activeBlock
      },
    },
  })
}
