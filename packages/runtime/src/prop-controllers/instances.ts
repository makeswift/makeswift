// import { Editor } from '../old-slate-react-types'
import { ValueJSON } from '../old-slate-types'
// import { OnChangeParam } from '../old-slate-react-types'
import { Descriptor, RichTextDescriptor, TableFormFieldsDescriptor, Types } from './descriptors'
import { BuilderEditMode } from '../state/modules/builder-edit-mode'
import { BoxModel } from '../state/modules/box-models'
import {
  RichTextControl,
  RichTextControlMessage,
  RichTextControlType,
  SlotControl,
  SlotControlMessage,
  SlotControlType,
} from '../controls'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

export const RichTextPropControllerMessageType = {
  CHANGE_BUILDER_EDIT_MODE: 'CHANGE_BUILDER_EDIT_MODE',
  INITIALIZE_EDITOR: 'INITIALIZE_EDITOR',
  CHANGE_EDITOR_VALUE: 'CHANGE_EDITOR_VALUE',
  FOCUS: 'FOCUS',
  BLUR: 'BLUR',
  UNDO: 'UNDO',
  REDO: 'REDO',
  CHANGE_BOX_MODEL: 'CHANGE_BOX_MODEL',
} as const

type ChangeBuilderEditModeRichTextPropControllerMessage = {
  type: typeof RichTextPropControllerMessageType.CHANGE_BUILDER_EDIT_MODE
  editMode: BuilderEditMode
}

type InitializeEditorRichTextPropControllerMessage = {
  type: typeof RichTextPropControllerMessageType.INITIALIZE_EDITOR
  value: ValueJSON
}

type ChangeEditorValueRichTextPropControllerMessage = {
  type: typeof RichTextPropControllerMessageType.CHANGE_EDITOR_VALUE
  value: ValueJSON
}

type FocusRichTextPropControllerMessage = { type: typeof RichTextPropControllerMessageType.FOCUS }

type BlurRichTextPropControllerMessage = { type: typeof RichTextPropControllerMessageType.BLUR }

type UndoRichTextPropControllerMessage = { type: typeof RichTextPropControllerMessageType.UNDO }

type RedoRichTextPropControllerMessage = { type: typeof RichTextPropControllerMessageType.REDO }

type ChangeBoxModelRichTextPropControllerMessage = {
  type: typeof RichTextPropControllerMessageType.CHANGE_BOX_MODEL
  payload: { boxModel: BoxModel | null }
}

export type RichTextPropControllerMessage =
  | ChangeBuilderEditModeRichTextPropControllerMessage
  | InitializeEditorRichTextPropControllerMessage
  | ChangeEditorValueRichTextPropControllerMessage
  | FocusRichTextPropControllerMessage
  | BlurRichTextPropControllerMessage
  | UndoRichTextPropControllerMessage
  | RedoRichTextPropControllerMessage
  | ChangeBoxModelRichTextPropControllerMessage

export type PropControllerMessage =
  | RichTextPropControllerMessage
  | TableFormFieldsMessage
  | SlotControlMessage
  | RichTextControlMessage

export type Send<T = PropControllerMessage> = (message: T) => void

export abstract class PropController<T = PropControllerMessage> {
  protected send: Send<T>

  constructor(send: Send<T>) {
    this.send = send
  }

  abstract recv(message: T): void
}

class DefaultPropController extends PropController {
  recv(_message: PropControllerMessage): void {
    // Do nothing.
  }
}

class RichTextPropController extends PropController<RichTextPropControllerMessage> {
  private editor: Editor | null = null

  recv(message: RichTextPropControllerMessage): void {
    switch (message.type) {
      case RichTextPropControllerMessageType.CHANGE_BUILDER_EDIT_MODE: {
        switch (message.editMode) {
          case BuilderEditMode.BUILD:
          case BuilderEditMode.INTERACT:
            if (this.editor) {
              Transforms.deselect(this.editor)
              ReactEditor.blur(this.editor)
            }
            break
        }
        break
      }
      case RichTextPropControllerMessageType.FOCUS: {
        console.log('focused')

        console.log(this.editor)

        if (this.editor) {
          ReactEditor.focus(this.editor)

          // Transforms.select(this.editor, {
          //   anchor: Editor.start(this.editor, []),
          //   focus: Editor.end(this.editor, []),
          // })
        }
        break
      }
    }
  }

  setSlateEditor(editor: any /* Editor */) {
    this.editor = editor

    this.send({
      type: RichTextPropControllerMessageType.INITIALIZE_EDITOR,
      value: editor.value.toJSON({ preserveSelection: false }),
    })
  }

  onChange(change: any /* OnChangeParam */) {
    this.send({
      type: RichTextPropControllerMessageType.CHANGE_EDITOR_VALUE,
      value: change.value.toJSON({ preserveSelection: true }),
    })
  }

  focus() {
    this.send({ type: RichTextPropControllerMessageType.FOCUS })
  }

  blur() {
    this.send({ type: RichTextPropControllerMessageType.BLUR })
  }

  undo() {
    this.send({ type: RichTextPropControllerMessageType.UNDO })
  }

  redo() {
    this.send({ type: RichTextPropControllerMessageType.REDO })
  }

  changeBoxModel(boxModel: BoxModel | null): void {
    this.send({ type: RichTextPropControllerMessageType.CHANGE_BOX_MODEL, payload: { boxModel } })
  }
}

export const TableFormFieldsMessageType = {
  TABLE_FORM_LAYOUT_CHANGE: 'TABLE_FORM_LAYOUT_CHANGE',
  TABLE_FORM_FIELD_LAYOUT_CHANGE: 'TABLE_FORM_FIELD_LAYOUT_CHANGE',
} as const

type TableLayoutTableFormFieldsMessage = {
  type: typeof TableFormFieldsMessageType.TABLE_FORM_LAYOUT_CHANGE
  payload: { layout: BoxModel }
}

type TableFieldLayoutTableFormFieldsMessage = {
  type: typeof TableFormFieldsMessageType.TABLE_FORM_FIELD_LAYOUT_CHANGE
  payload: { layout: BoxModel; index: number }
}

export type TableFormFieldsMessage =
  | TableLayoutTableFormFieldsMessage
  | TableFieldLayoutTableFormFieldsMessage

export class TableFormFieldsPropController extends PropController<TableFormFieldsMessage> {
  recv(): void {}

  tableFormLayoutChange(payload: { layout: BoxModel }) {
    this.send({ type: TableFormFieldsMessageType.TABLE_FORM_LAYOUT_CHANGE, payload })
  }

  tableFormFieldLayoutChange(payload: { layout: BoxModel; index: number }) {
    this.send({ type: TableFormFieldsMessageType.TABLE_FORM_FIELD_LAYOUT_CHANGE, payload })
  }
}

type DescriptorPropController<T extends Descriptor> = T extends { type: typeof Types.RichText }
  ? RichTextPropController
  : T extends { type: typeof RichTextControlType }
  ? RichTextControl
  : T extends { type: typeof Types.TableFormFields }
  ? TableFormFieldsPropController
  : DefaultPropController

export type DescriptorsPropControllers<T extends Record<string, Descriptor>> = {
  [K in keyof T]: undefined extends T[K]
    ? DescriptorPropController<Exclude<T[K], undefined>>
    : DescriptorPropController<T[K]>
}

type AnyPropController =
  | DefaultPropController
  | RichTextPropController
  | TableFormFieldsPropController
  | SlotControl
  | RichTextControl

export function createPropController(
  descriptor: RichTextDescriptor,
  send: Send<RichTextPropControllerMessage>,
): RichTextPropController
export function createPropController(
  descriptor: TableFormFieldsDescriptor,
  send: Send<TableFormFieldsMessage>,
): TableFormFieldsPropController
export function createPropController(descriptor: Descriptor, send: Send): DefaultPropController
export function createPropController<T extends PropControllerMessage>(
  descriptor: Descriptor,
  send: Send<T>,
): AnyPropController {
  switch (descriptor.type) {
    case Types.RichText:
      return new RichTextPropController(send as Send<RichTextPropControllerMessage>)

    case Types.TableFormFields:
      return new TableFormFieldsPropController(send as Send<TableFormFieldsMessage>)

    case SlotControlType:
      return new SlotControl(send as Send<SlotControlMessage>)

    case RichTextControlType:
      return new RichTextControl(send as Send<RichTextControlMessage>)

    default:
      return new DefaultPropController(send as Send)
  }
}
