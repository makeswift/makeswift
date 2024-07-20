import { Descriptor, isLegacyDescriptor } from './descriptors'
import { BoxModel } from '../state/modules/box-models'
import { RichTextControl, RichTextControlMessage, RichTextControlType } from '../controls/rich-text'
import {
  RichTextV2ControlMessage,
  RichTextV2ControlType,
  RichTextV2Control,
} from '../controls/rich-text-v2'
import { StyleV2Control, StyleV2ControlType, StyleV2ControlMessage } from '../controls/style-v2'
import { Types as PropControllerTypes } from '@makeswift/prop-controllers'

import {
  type ControlMessage,
  type SendMessage,
  ControlInstance,
  DefaultControlInstance,
} from '@makeswift/controls'

export type PropControllerMessage = ControlMessage

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

export class TableFormFieldsPropController extends ControlInstance<TableFormFieldsMessage> {
  recv = () => {}
  child(_key: string): ControlInstance | undefined {
    return undefined
  }

  tableFormLayoutChange(payload: { layout: BoxModel }) {
    this.sendMessage({ type: TableFormFieldsMessageType.TABLE_FORM_LAYOUT_CHANGE, payload })
  }

  tableFormFieldLayoutChange(payload: { layout: BoxModel; index: number }) {
    this.sendMessage({ type: TableFormFieldsMessageType.TABLE_FORM_FIELD_LAYOUT_CHANGE, payload })
  }
}

type DescriptorPropController<T extends Descriptor> = T extends { type: typeof RichTextControlType }
  ? RichTextControl
  : T extends { type: typeof RichTextV2ControlType }
    ? RichTextV2Control
    : T extends { type: typeof PropControllerTypes.TableFormFields }
      ? TableFormFieldsPropController
      : ControlInstance

export type DescriptorsPropControllers<T extends Record<string, Descriptor>> = {
  [K in keyof T]: undefined extends T[K]
    ? DescriptorPropController<Exclude<T[K], undefined>>
    : DescriptorPropController<T[K]>
}

export type AnyPropController =
  | ControlInstance
  | RichTextControl
  | TableFormFieldsPropController
  | RichTextControl
  | RichTextV2Control
  | StyleV2Control

export function createPropController(
  descriptor: Descriptor,
  send: SendMessage<PropControllerMessage>,
): AnyPropController {
  if (!isLegacyDescriptor(descriptor)) {
    return descriptor.createInstance(send)
  }

  switch (descriptor.type) {
    case PropControllerTypes.TableFormFields:
      return new TableFormFieldsPropController(send as SendMessage<TableFormFieldsMessage>)

    case RichTextControlType:
      return new RichTextControl(send as SendMessage<RichTextControlMessage>)

    case RichTextV2ControlType:
      return new RichTextV2Control(send as SendMessage<RichTextV2ControlMessage>, descriptor)

    case StyleV2ControlType:
      return new StyleV2Control(send as SendMessage<StyleV2ControlMessage>, descriptor)

    default:
      return new DefaultControlInstance(send as SendMessage)
  }
}
