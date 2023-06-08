/** @jsx jsxWithV2InlineEditor */

import { ComponentType } from 'react'
import { Editor as SlateEditor } from 'slate'
import { jsxWithV2InlineEditor } from './slate-test-helper'

const EditorElement = 'editor' as any as ComponentType<{
  children: string | JSX.Element | (string | JSX.Element)[]
}>

export const InlineEditor = (input: JSX.Element): SlateEditor => {
  return (<EditorElement>{input}</EditorElement>) as any as SlateEditor
}
