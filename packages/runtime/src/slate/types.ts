import { type BaseEditor } from 'slate'
import { type ReactEditor } from 'slate-react'
import { Slate } from '@makeswift/controls'

import { type BuilderEditor, type TypographyEditor } from '.'
import { type LocalChangesEditor } from './LocalChangesPlugin'
import { type SelectionEditor } from './SelectionPlugin/with-selection'

export const BlockType = Slate.BlockType
export const InlineType = Slate.InlineType

export type MakeswiftEditor = BaseEditor &
  ReactEditor &
  BuilderEditor &
  LocalChangesEditor &
  TypographyEditor &
  SelectionEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: MakeswiftEditor
  }
}
