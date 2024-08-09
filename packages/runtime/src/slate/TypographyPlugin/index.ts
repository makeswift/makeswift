import { BaseEditor, Descendant, Editor, NodeEntry, Text, Transforms } from 'slate'
import { unstable_Typography } from '@makeswift/controls'

import { clearActiveTypographyStyle } from './clearActiveTypographyStyle'
import { clearDeviceActiveTypography } from './clearDeviceActiveTypography'
import { detachActiveTypography } from './detachActiveTypography'
import { setActiveTypographyId } from './setActiveTypographyId'
import { setActiveTypographyStyle } from './setActiveTypographyStyle'
import { getValue } from './getValue'
import { getSelection } from '../selectors'
import { Plugin } from '../../controls/rich-text-v2/plugin'
import { normalizeTypographyUp } from './normalizeTypographyUp'
import { normalizeTypographyDown } from './normalizeTypographyDown'
import { normalizeSimilarText } from './normalizeSimilarText'

export const TypographyActions = {
  setActiveTypographyId,
  setActiveTypographyStyle,
  clearActiveTypographyStyle,
  clearDeviceActiveTypography,
  detachActiveTypography,
}

export const TYPOGRAPHY_KEY = 'typography'

export interface TypographyEditor extends BaseEditor {
  typographyNormalizationDirection?: 'up' | 'neutral' | 'down'
}

export function withTypography(editor: Editor) {
  const { normalizeNode } = editor
  editor.normalizeNode = entry => {
    const [normalizationNode, normalizationPath] = entry

    if (
      'typography' in normalizationNode &&
      normalizationNode?.typography?.id == null &&
      normalizationNode?.typography?.style.length === 0
    ) {
      Transforms.unsetNodes(editor, TYPOGRAPHY_KEY, { at: normalizationPath })
      return
    }

    if ('slice' in normalizationNode && normalizationNode?.slice != null) {
      Transforms.unsetNodes(editor, 'slice', { at: normalizationPath })
      return
    }

    if (normalizeSimilarText(editor, entry)) return

    if (editor.typographyNormalizationDirection === 'up' && normalizeTypographyUp(editor, entry))
      return

    if (
      (editor.typographyNormalizationDirection === 'down' ||
        editor.typographyNormalizationDirection == null) &&
      normalizeTypographyDown(editor, entry)
    )
      return

    normalizeNode(entry)
  }

  return editor
}

export function TypographyPlugin() {
  return Plugin({
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
      getValue,
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
