import { type Descriptor, isLegacyDescriptor } from './descriptors'
import { type BoxModel } from '../state/modules/read-write/box-models'
import { Types as PropControllerTypes } from '@makeswift/prop-controllers'

import {
  type ControlMessage,
  type SendMessage,
  type InstanceType,
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

type DescriptorPropController<T extends Descriptor> = T extends {
  type: typeof PropControllerTypes.TableFormFields
}
  ? TableFormFieldsPropController
  : InstanceType<T>

export type DescriptorsPropControllers<T extends Record<string, Descriptor>> = {
  [K in keyof T]: undefined extends T[K]
    ? DescriptorPropController<Exclude<T[K], undefined>>
    : DescriptorPropController<T[K]>
}

export type AnyPropController = ControlInstance<any> | TableFormFieldsPropController

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

    default:
      return new DefaultControlInstance(send as SendMessage)
  }
}
