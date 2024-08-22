import { Editor, NodeEntry, Text } from 'slate'
import { Slate } from '@makeswift/controls'

import { getSelection } from '../selectors'
import { filterForSubtreeRoots } from '../BlockPlugin/utils/filterForSubtreeRoots'
import deepEqual from '../../utils/deepEqual'

export function getLinksAndTextInSelection(editor: Editor): NodeEntry<Slate.LinkElement | Text>[] {
  return Array.from(
    Editor.nodes(editor, {
      at: getSelection(editor),
      match: node => (Slate.isInline(node) && Slate.isLink(node)) || Text.isText(node),
    }),
  ) as NodeEntry<Text | Slate.LinkElement>[]
}

export const getValue = (editor: Editor) => {
  const roots = filterForSubtreeRoots(getLinksAndTextInSelection(editor))

  const areAllRootsLinks = roots.every(([root]) => Slate.isLink(root) || Text.isText(root))

  if (!areAllRootsLinks) return undefined

  const matchingValues = roots.map(([node]) => node).filter(Slate.isLink) as (
    | Slate.LinkElement
    | null
    | undefined
  )[]

  const match = matchingValues.reduce(
    (a, b) => (deepEqual(a?.link, b?.link) ? b : null),
    matchingValues.at(0) ?? undefined,
  )

  return match == null ? match : match.link
}
