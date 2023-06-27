import { Editor, Text } from 'slate'
import { RichTextTypography } from '../types'
import { getSelection } from '../selectors'
import deepEqual from '../../utils/deepEqual'

export function getValue(editor: Editor) {
  const matchingValues = Array.from(
    Editor.nodes(editor, {
      at: getSelection(editor),
      match: Text.isText,
    }),
  ).map(([node]) => node['typography']) as (RichTextTypography | undefined)[]

  if (matchingValues.length === 0) {
    return undefined
  }

  return (
    matchingValues.reduce((a, b) => (deepEqual(a, b) ? b : undefined), matchingValues.at(0)) ?? null
  )
}
