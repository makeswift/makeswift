import { Editor } from 'slate'
import { ElementUtils } from '../utils/element'
import { ResponsiveBlockTextAlignment } from '../types'
import { getSelection } from '../selectors'
import { responsiveShallowEqual } from '../utils/responsive'

export function getValue(editor: Editor): ResponsiveBlockTextAlignment | undefined {
  const matchingValues = Array.from(
    Editor.nodes(editor, {
      at: getSelection(editor),
      match: ElementUtils.isRootBlock,
    }),
  ).map(([node]) => node['textAlign']) as (ResponsiveBlockTextAlignment | undefined)[]

  return matchingValues.length === 0
    ? undefined
    : matchingValues.reduce((a, b) => {
        return responsiveShallowEqual(a, b)
      })
}
