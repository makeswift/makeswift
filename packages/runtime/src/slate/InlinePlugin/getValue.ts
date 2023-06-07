import { Editor, NodeEntry, Text } from 'slate'
import { ElementUtils } from '../utils/element'
import { getSelection } from '../selectors'
import { filterForSubtreeRoots } from '../BlockPlugin/utils/filterForSubtreeRoots'
import deepEqual from '../../utils/deepEqual'
import { SupportedInline, isSupportedInlineType, isSupportedInlineEntry } from './types'

export function getSupportedInlinesAndTextInSelection(
  editor: Editor,
): NodeEntry<SupportedInline | Text>[] {
  return Array.from(
    Editor.nodes(editor, {
      at: getSelection(editor),
      match: node =>
        (ElementUtils.isInline(node) && isSupportedInlineType(node.type)) || Text.isText(node),
    }),
  ) as NodeEntry<Text | SupportedInline>[]
}

export const getValue = (editor: Editor) => {
  const roots = filterForSubtreeRoots(getSupportedInlinesAndTextInSelection(editor))

  const areAllRootsSupportedInlineTypesOrText = roots.every(
    entry => isSupportedInlineEntry(entry) || Text.isText(entry[0]),
  )

  if (!areAllRootsSupportedInlineTypesOrText) return undefined

  const matchingValues = roots.filter(isSupportedInlineEntry).map(([node]) => node)

  return matchingValues.reduce((a, b) => (deepEqual(a, b) ? b : undefined), matchingValues.at(0))
    ?.type
}
