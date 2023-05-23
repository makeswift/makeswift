import { Editor } from 'slate'
import { Descriptor, RichTextDescriptor, TableFormFieldsDescriptor, Types } from './descriptors'
import { BuilderEditMode } from '../state/modules/builder-edit-mode'
import { BoxModel } from '../state/modules/box-models'
import {
  ListControl,
  ListControlMessage,
  ListControlType,
  RichTextControl,
  RichTextControlMessage,
  RichTextControlType,
  ShapeControl,
  ShapeControlMessage,
  ShapeControlType,
  richTextDAOToDTO,
  RichTextDTO,
  SlotControl,
  SlotControlMessage,
  SlotControlType,
  StyleControl,
  StyleControlType,
  StyleControlMessage,
  RichTextV2ControlMessage,
  RichTextV2ControlType,
  RichTextV2Control,
  StyleV2Control,
  StyleV2ControlType,
  StyleV2ControlMessage,
} from '../controls'
import { PropController } from './base'

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
  value: RichTextDTO
}

type ChangeEditorValueRichTextPropControllerMessage = {
  type: typeof RichTextPropControllerMessageType.CHANGE_EDITOR_VALUE
  value: RichTextDTO
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
  | RichTextV2ControlMessage
  | ListControlMessage
  | ShapeControlMessage
  | StyleControlMessage

export type Send<T = PropControllerMessage> = (message: T) => void

class DefaultPropController extends PropController {
  recv = (_message: PropControllerMessage) => {
    // Do nothing.
  }
}

class RichTextPropController extends PropController<RichTextPropControllerMessage> {
  private editor: Editor | null = null

  recv = (message: RichTextPropControllerMessage) => {
    if (!this.editor) return
    switch (message.type) {
      case RichTextPropControllerMessageType.CHANGE_BUILDER_EDIT_MODE: {
        switch (message.editMode) {
          case BuilderEditMode.BUILD:
          case BuilderEditMode.INTERACT:
            this.editor.deselectAndBlur()
        }
        break
      }
      case RichTextPropControllerMessageType.FOCUS: {
        this.editor.focusAndSelectAll()
        break
      }
    }
  }

  setSlateEditor(editor: Editor) {
    this.editor = editor

    this.send({
      type: RichTextPropControllerMessageType.INITIALIZE_EDITOR,
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
          type: RichTextPropControllerMessageType.CHANGE_EDITOR_VALUE,
          value: richTextDAOToDTO(editor.children, editor.selection),
        })
      }
    }
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
  recv = () => {}

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
  : T extends { type: typeof RichTextV2ControlType }
  ? RichTextV2Control
  : T extends { type: typeof Types.TableFormFields }
  ? TableFormFieldsPropController
  : DefaultPropController

export type DescriptorsPropControllers<T extends Record<string, Descriptor>> = {
  [K in keyof T]: undefined extends T[K]
    ? DescriptorPropController<Exclude<T[K], undefined>>
    : DescriptorPropController<T[K]>
}

export type AnyPropController =
  | DefaultPropController
  | RichTextPropController
  | TableFormFieldsPropController
  | SlotControl
  | RichTextControl
  | RichTextV2Control
  | ListControl
  | ShapeControl
  | StyleControl
  | StyleV2Control

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

    case RichTextV2ControlType:
      return new RichTextV2Control(send as Send<RichTextV2ControlMessage>, descriptor)

    case ListControlType:
      return new ListControl(send as Send<ListControlMessage>, descriptor)

    case ShapeControlType:
      return new ShapeControl(send as Send<ShapeControlMessage>, descriptor)

    case StyleControlType:
      return new StyleControl(send as Send<StyleControlMessage>)

    case StyleV2ControlType:
      return new StyleV2Control(send as Send<StyleV2ControlMessage>)

    default:
      return new DefaultPropController(send as Send)
  }
}
