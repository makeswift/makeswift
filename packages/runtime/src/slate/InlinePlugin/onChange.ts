import { Editor, Transforms } from 'slate'
import { Slate } from '@makeswift/controls'

import { getSupportedInlinesAndTextInSelection } from './getValue'
import { unwrapInline } from '../BlockPlugin/unwrapInline'
import { wrapInline } from '../BlockPlugin/wrapInline'
import { getSelection } from '../selectors'
import { filterForSubtreeRoots } from '../BlockPlugin/utils/filterForSubtreeRoots'
import {
  SupportedInlineType,
  isSupportedInlineEntry,
  isSupportedInlineType,
  supportedInlineOptions,
} from './types'

export const onChange = (editor: Editor, value: SupportedInlineType) => {
  function unwrapAllSupportedTypes() {
    supportedInlineOptions.forEach(({ value: optionValue }) => unwrapInline(editor, optionValue))
  }

  function unwrapAllInlines() {
    Transforms.unwrapNodes(editor, {
      match: node => Slate.isInline(node),
      at: getSelection(editor),
    })
  }

  if (value == null) return unwrapAllSupportedTypes()

  if (!isSupportedInlineType(value)) return

  const roots = filterForSubtreeRoots(getSupportedInlinesAndTextInSelection(editor))
  const root = roots.at(0)

  if (
    roots.length === 1 &&
    root != null &&
    isSupportedInlineEntry(root) &&
    root[0].type === value
  ) {
    unwrapInline(editor, value)
  } else {
    unwrapAllInlines()
    wrapInline(editor, { type: value, children: [] })
  }
}
