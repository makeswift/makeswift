import { IndexSignatureHack } from '../prop-controllers/descriptors'
import type * as Slate from 'slate'
import { BuilderEditMode } from '../state/modules/builder-edit-mode'
import { PropController } from '../prop-controllers/instances'
import { OnChangeParam, Editor } from 'slate-react'
import { BoxModel } from '../box-model'

export type RichTextControlData = IndexSignatureHack<Slate.ValueJSON>

export const RichTextControlType = 'makeswift::controls::rich-text'

export type RichTextControlDefinition = {
  type: typeof RichTextControlType
}

export function RichText(): RichTextControlDefinition {
  return { type: RichTextControlType }
}

export const RichTextControlMessageType = {
  CHANGE_BUILDER_EDIT_MODE: 'CHANGE_BUILDER_EDIT_MODE',
  INITIALIZE_EDITOR: 'INITIALIZE_EDITOR',
  CHANGE_EDITOR_VALUE: 'CHANGE_EDITOR_VALUE',
  FOCUS: 'FOCUS',
  BLUR: 'BLUR',
  UNDO: 'UNDO',
  REDO: 'REDO',
  CHANGE_BOX_MODEL: 'CHANGE_BOX_MODEL',
} as const

type ChangeBuilderEditModeRichTextControlMessage = {
  type: typeof RichTextControlMessageType.CHANGE_BUILDER_EDIT_MODE
  editMode: BuilderEditMode
}

type InitializeEditorRichTextControlMessage = {
  type: typeof RichTextControlMessageType.INITIALIZE_EDITOR
  value: Slate.ValueJSON
}

type ChangeEditorValueRichTextControlMessage = {
  type: typeof RichTextControlMessageType.CHANGE_EDITOR_VALUE
  value: Slate.ValueJSON
}

type FocusRichTextControlMessage = { type: typeof RichTextControlMessageType.FOCUS }

type BlurRichTextControlMessage = { type: typeof RichTextControlMessageType.BLUR }

type UndoRichTextControlMessage = { type: typeof RichTextControlMessageType.UNDO }

type RedoRichTextControlMessage = { type: typeof RichTextControlMessageType.REDO }

type BoxModelChangeRichControlMessage = {
  type: typeof RichTextControlMessageType.CHANGE_BOX_MODEL
  payload: { boxModel: BoxModel | null }
}

export type RichTextControlMessage =
  | ChangeBuilderEditModeRichTextControlMessage
  | InitializeEditorRichTextControlMessage
  | ChangeEditorValueRichTextControlMessage
  | FocusRichTextControlMessage
  | BlurRichTextControlMessage
  | UndoRichTextControlMessage
  | RedoRichTextControlMessage
  | BoxModelChangeRichControlMessage

export class RichTextControl extends PropController<RichTextControlMessage> {
  private editor: Editor | null = null

  recv(message: RichTextControlMessage): void {
    switch (message.type) {
      case RichTextControlMessageType.CHANGE_BUILDER_EDIT_MODE: {
        switch (message.editMode) {
          case BuilderEditMode.BUILD:
            this.editor?.deselect().blur()
            break
        }
        break
      }
      case RichTextControlMessageType.FOCUS: {
        this.editor?.focus().moveToRangeOfDocument()
        break
      }
    }
  }

  setSlateEditor(editor: Editor) {
    this.editor = editor

    this.send({
      type: RichTextControlMessageType.INITIALIZE_EDITOR,
      value: editor.value.toJSON({ preserveSelection: false }),
    })
  }

  onChange(change: OnChangeParam) {
    this.send({
      type: RichTextControlMessageType.CHANGE_EDITOR_VALUE,
      value: change.value.toJSON({ preserveSelection: true }),
    })
  }

  focus() {
    this.send({ type: RichTextControlMessageType.FOCUS })
  }

  blur() {
    this.send({ type: RichTextControlMessageType.BLUR })
  }

  undo() {
    this.send({ type: RichTextControlMessageType.UNDO })
  }

  redo() {
    this.send({ type: RichTextControlMessageType.REDO })
  }

  changeBoxModel(boxModel: BoxModel | null): void {
    this.send({ type: RichTextControlMessageType.CHANGE_BOX_MODEL, payload: { boxModel } })
  }
}
