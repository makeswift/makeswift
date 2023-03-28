import { Editor, Text, Transforms } from 'slate'
import { clearActiveTypographyStyle } from './clearActiveTypographyStyle'
import { clearDeviceActiveTypography } from './clearDeviceActiveTypography'
import { detachActiveTypography } from './detachActiveTypography'
import { setActiveTypographyId } from './setActiveTypographyId'
import { setActiveTypographyStyle } from './setActiveTypographyStyle'

export const Typography = {
  setActiveTypographyId,
  setActiveTypographyStyle,
  clearActiveTypographyStyle,
  clearDeviceActiveTypography,
  detachActiveTypography,
}

export function withTypography(editor: Editor) {
  const { normalizeNode } = editor
  editor.normalizeNode = entry => {
    const [normalizationNode, normalizationPath] = entry
    // Normalization typography with empty style and id to be text
    if (
      Text.isText(normalizationNode) &&
      normalizationNode?.typography?.id == null &&
      normalizationNode?.typography?.style.length === 0
    ) {
      Transforms.unsetNodes(editor, 'typography', { at: normalizationPath })
      return
    }

    normalizeNode(entry)
  }

  return editor
}
