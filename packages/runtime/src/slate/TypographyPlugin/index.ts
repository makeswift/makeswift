import { Editor, Text, Transforms } from 'slate'
import { clearActiveTypographyStyle } from './clearActiveTypographyStyle'
import { clearDeviceActiveTypography } from './clearDeviceActiveTypography'
import { detachActiveTypography } from './detachActiveTypography'
import { setActiveTypographyId } from './setActiveTypographyId'
import { setActiveTypographyStyle } from './setActiveTypographyStyle'
import { createRichTextV2Plugin, unstable_Typography } from '../../controls'
import { setResponsiveValue } from '../utils/responsive'
import { getValue } from './getValue'

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
        setResponsiveValue(editor, TYPOGRAPHY_KEY, value, {
          match: Text.isText,
          split: true,
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
