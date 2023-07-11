import { Descendant, Editor, NodeEntry, Text, Transforms } from 'slate'
import { clearActiveTypographyStyle } from './clearActiveTypographyStyle'
import { clearDeviceActiveTypography } from './clearDeviceActiveTypography'
import { detachActiveTypography } from './detachActiveTypography'
import { setActiveTypographyId } from './setActiveTypographyId'
import { setActiveTypographyStyle } from './setActiveTypographyStyle'
import { unstable_Typography } from '../../controls'
import { getValue } from './getValue'
import { getSelection } from '../selectors'
import { createRichTextV2Plugin } from '../../controls/rich-text-v2/plugin'

export const TypographyActions = {
  setActiveTypographyId,
  setActiveTypographyStyle,
  clearActiveTypographyStyle,
  clearDeviceActiveTypography,
  detachActiveTypography,
}

export const TYPOGRAPHY_KEY = 'typography'

export function withTypography(editor: Editor) {
  const { normalizeNode } = editor
  editor.normalizeNode = entry => {
    const [normalizationNode, normalizationPath] = entry
    if (
      Text.isText(normalizationNode) &&
      normalizationNode?.typography?.id == null &&
      normalizationNode?.typography?.style.length === 0
    ) {
      Transforms.unsetNodes(editor, TYPOGRAPHY_KEY, { at: normalizationPath })
      return
    }

    if (Text.isText(normalizationNode) && normalizationNode?.slice != null) {
      Transforms.unsetNodes(editor, 'slice', { at: normalizationPath })
      return
    }

    normalizeNode(entry)
  }

  return editor
}

export function TypographyPlugin() {
  return createRichTextV2Plugin({
    withPlugin: withTypography,
    control: {
      definition: unstable_Typography(),
      onChange: (editor, value) => {
        Editor.withoutNormalizing(editor, () => {
          const at = getSelection(editor)
          if (!at) return
          const atRef = Editor.rangeRef(editor, at)
          if (atRef.current) {
            Transforms.setNodes<Descendant>(
              editor,
              {
                slice: true,
              },
              {
                at: atRef.current,
                match: Text.isText,
                split: true,
              },
            )
          }

          if (atRef.current) {
            const nodesToUpdate = Array.from(
              Editor.nodes(editor, {
                at: atRef.current,
                match: node => Text.isText(node) && node.slice === true,
              }),
            ) as NodeEntry<Text>[]

            if (nodesToUpdate.length !== value?.length)
              return console.error(
                `TypographyControl.onChange received the wrong number of arguments.
Called with ${value?.length} values mapping to ${nodesToUpdate.length} nodes.`,
              )

            for (const [index, [, path]] of nodesToUpdate.entries()) {
              Transforms.setNodes(
                editor,
                {
                  typography: value?.at(index),
                },
                { at: path, match: Text.isText },
              )
            }
          }

          atRef.unref()
        })
      },
      getValue: editor => getValue(editor),
      getLeafValue: (text: Text) => {
        return Text.isText(text) ? text.typography : undefined
      },
    },
    renderLeaf: (renderLeaf, className) => props => {
      return renderLeaf({
        ...props,
        leaf: {
          ...props.leaf,
          className: `${props.leaf.className} ${className}`,
        },
      })
    },
  })
}
