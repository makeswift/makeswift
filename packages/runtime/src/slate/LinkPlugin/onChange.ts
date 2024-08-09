import { type Editor, Transforms } from 'slate'
import { type DataType, Slate } from '@makeswift/controls'

import { LinkDefinition } from '../../controls/link'

import { unwrapInline } from '../BlockPlugin/unwrapInline'
import { wrapInline } from '../BlockPlugin/wrapInline'
import { filterForSubtreeRoots } from '../BlockPlugin/utils/filterForSubtreeRoots'

import { isLinkEntry } from './types'
import { getLinksAndTextInSelection } from './getValue'

export const onChange = (editor: Editor, value: DataType<LinkDefinition>) => {
  if (value == null) return unwrapInline(editor, Slate.InlineType.Link)

  const roots = filterForSubtreeRoots(getLinksAndTextInSelection(editor))
  const root = roots.at(0)

  // If the root of our selection is a link we just want to modify it
  if (roots.length === 1 && root != null && isLinkEntry(root)) {
    Transforms.setNodes(
      editor,
      {
        link: value,
      },
      { at: root[1] },
    )
  }
  // In all other cases we want to remove all existing links and wrap the current selection in a new link
  else {
    unwrapInline(editor, Slate.InlineType.Link)
    wrapInline(editor, { type: Slate.InlineType.Link, link: value, children: [] })
  }
}
