import { Editor } from 'slate'
import { Slate } from '@makeswift/controls'

import { getSelection } from '../selectors'
import { responsiveShallowEqual } from '../utils/responsive'

export function getValue(editor: Editor): Slate.ResponsiveBlockTextAlignment | undefined {
  const matchingValues = Array.from(
    Editor.nodes(editor, {
      at: getSelection(editor),
      match: Slate.isRootBlock,
    }),
  ).map(([node]) => node['textAlign']) as (Slate.ResponsiveBlockTextAlignment | undefined)[]

  return matchingValues.length === 0
    ? undefined
    : matchingValues.reduce((a, b) => {
        return responsiveShallowEqual(a, b)
      })
}
