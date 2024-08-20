import { Editor } from 'slate'

import { BuilderEditMode } from '../../state/modules/builder-edit-mode'

import {
  ControlInstance,
  richTextDAOToDTO,
  type BoxModel,
  type RichTextValue,
} from '@makeswift/controls'

type ChangeBuilderEditModeMessage = {
  type: typeof RichTextControl.CHANGE_BUILDER_EDIT_MODE
  payload: { editMode: BuilderEditMode }
}

type InitializeEditorMessage = {
  type: typeof RichTextControl.INITIALIZE_EDITOR
  value: RichTextValue
}

type ChangeEditorValueMessage = {
  type: typeof RichTextControl.CHANGE_EDITOR_VALUE
  value: RichTextValue
}

type FocusMessage = {
  type: typeof RichTextControl.FOCUS
}

type BlurMessage = {
  type: typeof RichTextControl.BLUR
}

type UndoMessage = {
  type: typeof RichTextControl.UNDO
}

type RedoMessage = {
  type: typeof RichTextControl.REDO
}

type BoxModelChangeMessage = {
  type: typeof RichTextControl.CHANGE_BOX_MODEL
  payload: { boxModel: BoxModel | null }
}

type Message =
  | ChangeBuilderEditModeMessage
  | InitializeEditorMessage
  | ChangeEditorValueMessage
  | FocusMessage
  | BlurMessage
  | UndoMessage
  | RedoMessage
  | BoxModelChangeMessage

export class RichTextControl extends ControlInstance<Message> {
  static readonly CHANGE_BUILDER_EDIT_MODE = 'CHANGE_BUILDER_EDIT_MODE'
  static readonly INITIALIZE_EDITOR = 'INITIALIZE_EDITOR'
  static readonly CHANGE_EDITOR_VALUE = 'CHANGE_EDITOR_VALUE'
  static readonly FOCUS = 'FOCUS'
  static readonly BLUR = 'BLUR'
  static readonly UNDO = 'UNDO'
  static readonly REDO = 'REDO'
  static readonly CHANGE_BOX_MODEL = 'CHANGE_BOX_MODEL'

  private editor: Editor | null = null

  child(_key: string): ControlInstance | undefined {
    return undefined
  }

  recv = (message: Message): void => {
    if (!this.editor) return

    switch (message.type) {
      case RichTextControl.CHANGE_BUILDER_EDIT_MODE: {
        switch (message.payload.editMode) {
          case BuilderEditMode.BUILD:
          case BuilderEditMode.INTERACT:
            this.editor.deselectAndBlur()
        }
        break
      }

      case RichTextControl.FOCUS: {
        this.editor.focusAndSelectAll()
        break
      }
    }
  }

  setSlateEditor(editor: Editor) {
    this.editor = editor

    this.sendMessage({
      type: RichTextControl.INITIALIZE_EDITOR,
      value: richTextDAOToDTO(editor.children, editor.selection),
    })

    const _onChange = editor.onChange
    this.editor.onChange = options => {
      _onChange(options)

      // if onChange is local then it will include an operation(s)
      // that is the only case in which we want to push updates
      // this prevent infinite loops that can occur when collaborating
      if (options?.operation != null) {
        this.sendMessage({
          type: RichTextControl.CHANGE_EDITOR_VALUE,
          value: richTextDAOToDTO(editor.children, editor.selection),
        })
      }
    }
  }

  focus() {
    this.sendMessage({ type: RichTextControl.FOCUS })
  }

  blur() {
    this.sendMessage({ type: RichTextControl.BLUR })
  }

  undo() {
    this.sendMessage({ type: RichTextControl.UNDO })
  }

  redo() {
    this.sendMessage({ type: RichTextControl.REDO })
  }

  changeBoxModel(boxModel: BoxModel | null): void {
    this.sendMessage({
      type: RichTextControl.CHANGE_BOX_MODEL,
      payload: { boxModel },
    })
  }
}
