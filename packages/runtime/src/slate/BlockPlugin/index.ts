import { Editor, Transforms } from 'slate'
import { setBlockKeyForDevice } from './setBlockKeyForDevice'
import { clearBlockKeyForDevice } from './clearBlockKeyForDevice'
import { wrapInline } from './wrapInline'
import { unwrapInline } from './unwrapInline'
import { ElementUtils } from '../utils/element'

export const Block = {
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
