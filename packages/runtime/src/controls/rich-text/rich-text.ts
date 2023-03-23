import { BuilderEditMode } from '../../state/modules/builder-edit-mode'
import { PropController } from '../../prop-controllers/instances'
import { BoxModel } from '../../box-model'
import { RichTextDTO } from './dto-types'
import { Editor, Transforms } from 'slate'
import { richTextDAOToDTO } from './translation'
import { ReactEditor } from 'slate-react'

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
    if (!this.editor) return
    switch (message.type) {
      case RichTextControlMessageType.CHANGE_BUILDER_EDIT_MODE: {
        switch (message.editMode) {
          case BuilderEditMode.BUILD:
          case BuilderEditMode.INTERACT:
            ReactEditor.deselect(this.editor)
            ReactEditor.blur(this.editor)
        }
        break
      }
      case RichTextControlMessageType.FOCUS: {
        ReactEditor.focus(this.editor)
        Transforms.select(this.editor, {
          anchor: Editor.start(this.editor, []),
          focus: Editor.end(this.editor, []),
        })
        break
      }
    }
  }

  setSlateEditor(editor: Editor) {
    this.editor = editor

    this.send({
      type: RichTextControlMessageType.INITIALIZE_EDITOR,
      value: richTextDAOToDTO(editor.children, editor.selection),
    })

    const _onChange = editor.onChange
    this.editor.onChange = options => {
      _onChange(options)

      // if onChange is local then it will include an operation(s)
      // that is the only case in which we want to push updates
      // this prevent infinite loops that can occur when collaborating
      if (options?.operation != null) {
        this.send({
          type: RichTextControlMessageType.CHANGE_EDITOR_VALUE,
          value: richTextDAOToDTO(editor.children, editor.selection),
        })
      }
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
