import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { Slate } from '@makeswift/controls'

import { BuilderEditor, TypographyEditor } from '.'
import { LocalChangesEditor } from './LocalChangesPlugin'

export const BlockType = Slate.BlockType
export const InlineType = Slate.InlineType

export type MakeswiftEditor = BaseEditor &
  ReactEditor &
  BuilderEditor &
  LocalChangesEditor &
  TypographyEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: MakeswiftEditor
  }
}
