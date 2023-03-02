import { BuilderEditMode } from '../../state/modules/builder-edit-mode'
import { PropController } from '../../prop-controllers/instances'
import { BoxModel } from '../../box-model'
import { RichTextDTO } from './dto-types'
import { Editor } from 'slate'
import { richTextDAOToDTO } from './translation'

export type RichTextControlData = RichTextDTO

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
  value: RichTextDTO
}

type ChangeEditorValueRichTextControlMessage = {
  type: typeof RichTextControlMessageType.CHANGE_EDITOR_VALUE
  value: RichTextDTO
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
    console.log('message before switch', message)
    switch (message.type) {
      case RichTextControlMessageType.CHANGE_BUILDER_EDIT_MODE: {
        switch (message.editMode) {
          case BuilderEditMode.BUILD:
            // this.editor?.deselect().blur()
            break
        }
        break
      }
      case RichTextControlMessageType.FOCUS: {
        // this.editor?.focus().moveToRangeOfDocument()
        break
      }
      case RichTextControlMessageType.CHANGE_EDITOR_VALUE: {
        console.log('message', message)
      }
    }
  }

  setSlateEditor(editor: Editor) {
    this.editor = editor

    this.send({
      type: RichTextControlMessageType.INITIALIZE_EDITOR,
      value: richTextDAOToDTO(editor.children, editor.selection),
    })

    this.editor.onChange = () => {
      this.send({
        type: RichTextControlMessageType.CHANGE_EDITOR_VALUE,
        value: richTextDAOToDTO(editor.children, editor.selection),
      })
    }
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
