import { Editor, Transforms } from 'slate'
import { setBlockKeyForDevice } from './setBlockKeyForDevice'
import { clearBlockKeyForDevice } from './clearBlockKeyForDevice'
import { getInlinesInSelection, unwrapInline, wrapInline } from './wrapAndUnwrapInline'
import { ElementUtils } from '../utils/element'

export const Block = {
  setBlockKeyForDevice: setBlockKeyForDevice,
  clearBlockKeyForDevice: clearBlockKeyForDevice,
  unwrapInline,
  wrapInline,
  getInlinesInSelection,
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
