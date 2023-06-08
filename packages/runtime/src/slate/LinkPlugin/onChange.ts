import { Editor, Transforms } from 'slate'
import { LinkControlData } from '../../controls'
import { unwrapInline } from '../BlockPlugin/unwrapInline'
import { wrapInline } from '../BlockPlugin/wrapInline'
import { InlineType } from '../types'
import { filterForSubtreeRoots } from '../BlockPlugin/utils/filterForSubtreeRoots'
import { isLinkEntry } from './types'
import { getLinksAndTextInSelection } from './getValue'

export const onChange = (editor: Editor, value: LinkControlData) => {
  if (value == null) return unwrapInline(editor, InlineType.Link)

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
    unwrapInline(editor, InlineType.Link)
    wrapInline(editor, { type: InlineType.Link, link: value, children: [] })
  }
}
