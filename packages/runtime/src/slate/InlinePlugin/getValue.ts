import { Editor, NodeEntry, Text } from 'slate'
import { Slate } from '@makeswift/controls'

import { getSelection } from '../selectors'
import { filterForSubtreeRoots } from '../BlockPlugin/utils/filterForSubtreeRoots'
import { SupportedInline, isSupportedInlineType, isSupportedInlineEntry } from './types'

export function getSupportedInlinesAndTextInSelection(
  editor: Editor,
): NodeEntry<SupportedInline | Text>[] {
  return Array.from(
    Editor.nodes(editor, {
      at: getSelection(editor),
      match: node =>
        (Slate.isInline(node) && isSupportedInlineType(node.type)) || Text.isText(node),
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

  const match = matchingValues.reduce(
    (a, b) => (a?.type === b?.type ? b : undefined),
    matchingValues.at(0) ?? undefined,
  )

  return match == null ? null : match.type
}
