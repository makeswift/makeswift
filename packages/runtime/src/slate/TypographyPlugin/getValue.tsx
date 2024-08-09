import { Editor, Text } from 'slate'
import { RichTextTypography } from '@makeswift/controls'

import { getSelection } from '../selectors'

export function getValue(editor: Editor) {
  const matchingValues = Array.from(
    Editor.nodes(editor, {
      at: getSelection(editor),
      match: Text.isText,
    }),
  ).map(([node]) => node['typography']) as (RichTextTypography | undefined)[]

  return matchingValues
}
