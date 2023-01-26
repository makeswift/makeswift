import { IndexSignatureHack } from '../prop-controllers/descriptors'
import type * as Slate from 'slate'
import { BuilderEditMode } from '../utils/constants'
import { PropController } from '../prop-controllers/instances'
import { OnChangeParam, Editor } from 'slate-react'
import { BoxModel } from '../box-model'

// todo: Josh why are you doing this?
export type RichTextControlData = IndexSignatureHack<Slate.ValueJSON>

export const RichTextControlType = 'makeswift::controls::rich-text'

type RichTextControlConfig = {
  label?: string
  defaultValue?: RichTextControlData
}

export type RichTextDefinition<C extends RichTextControlConfig = RichTextControlConfig> = {
  type: typeof RichTextControlType
  config: C
}

export function RichText<C extends RichTextControlConfig>(
  config: C = {} as C,
): RichTextDefinition<C> {
  return { type: RichTextControlType, config }
}

export const RichTextControlMessageType = {
  CHANGE_BUILDER_EDIT_MODE: 'CHANGE_BUILDER_EDIT_MODE',
  INITIALIZE_EDITOR: 'INITIALIZE_EDITOR',
  CHANGE_EDITOR_VALUE: 'CHANGE_EDITOR_VALUE',
  FOCUS: 'FOCUS',
  BLUR: 'BLUR',
  UNDO: 'UNDO',
  REDO: 'REDO',

  BOX_MODEL_CHANGE: 'BOX_MODEL_CHANGE',
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
  type: typeof RichTextControlMessageType.BOX_MODEL_CHANGE
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
    console.log({ messageFromControl: message })
    switch (message.type) {
      case RichTextControlMessageType.CHANGE_BUILDER_EDIT_MODE: {
        switch (message.editMode) {
          case BuilderEditMode.BUILD:
            this.editor?.deselect().blur()
            break

          case BuilderEditMode.CONTENT:
            this.editor?.focus().moveToRangeOfDocument()
            break
        }

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
    this.send({ type: RichTextControlMessageType.BOX_MODEL_CHANGE, payload: { boxModel } })
  }
}

// todo:josh move all the rich text stuff from /prop-controllers/instances here and rename it to control rahter than prop-control

// todo:josh replace this with something similar to copy in `/prop-controllers/copy/rich-text.ts`
// export function copySlotData(
//   value: SlotControlData | undefined,
//   context: CopyContext,
// ): SlotControlData | undefined {
//   if (value == null) return value

//   return {
//     ...value,
//     elements: value.elements.map(element => context.copyElement(element)),
//   }
// }
