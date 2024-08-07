import {
  CheckboxControlDefinition,
  NumberControlDefinition,
  TextInputControlDefinition,
  TextAreaControlDefinition,
  ColorData,
  Data,
  ColorControlDefinition,
  ComboboxControlData,
  ComboboxControlDefinition,
  IconRadioGroupControlData,
  IconRadioGroupControlDefinition,
  ImageControlData,
  ImageControlDefinition,
  LinkControlData,
  LinkControlDefinition,
} from '@makeswift/controls'

import {
  AnyPropController,
  createPropController,
  PropControllerMessage,
  Send,
} from '../prop-controllers/instances'
import { PropController } from '../prop-controllers/base'
import { CopyContext, MergeTranslatableDataContext } from '../state/react-page'
import {
  ControlDefinition,
  ControlDefinitionData,
  getTranslatableData,
  mergeTranslatedData,
} from './control'

import { copy as controlCopy } from './control'
import {
  getElementChildren,
  getFileIds,
  getPageIds,
  getSwatchIds,
  getTypographyIds,
} from '../prop-controllers/introspection'
import { SelectControlData, SelectControlDefinition } from './select'
import { ShapeControlDefinition } from './shape'
import { RichTextControlData, RichTextControlDefinition } from './rich-text'
import { RichTextV2ControlData, RichTextV2ControlDefinition } from './rich-text-v2'
import { StyleControlData, StyleControlDefinition } from './style'
import { StyleV2ControlData, StyleV2ControlDefinition } from './style-v2'
import { TypographyControlData, TypographyControlDefinition } from './typography'
import { IndexSignatureHack } from '../utils/index-signature-hack'

export type GetItemLabelControlData<T extends ControlDefinition> = T extends CheckboxControlDefinition
  ? boolean
  : T extends NumberControlDefinition
  ? number
  : T extends TextInputControlDefinition
  ? string
  : T extends TextAreaControlDefinition
  ? string
  : T extends SelectControlDefinition
  ? SelectControlData<T>
  : T extends ColorControlDefinition
  ? ColorData
  : T extends IconRadioGroupControlDefinition
  ? IconRadioGroupControlData<T>
  : T extends ImageControlDefinition
  ? ImageControlData
  : T extends ComboboxControlDefinition
  ? ComboboxControlData<T>
  : T extends ShapeControlDefinition
  ? GetItemLabelShapeControlData<T>
  : T extends ListControlDefinition
  ? GetItemListControlData<T>
  : T extends LinkControlDefinition
  ? LinkControlData
  : T extends RichTextControlDefinition
  ? IndexSignatureHack<RichTextControlData>
  : T extends RichTextV2ControlDefinition
  ? RichTextV2ControlData
  : T extends StyleControlDefinition
  ? StyleControlData
  : T extends StyleV2ControlDefinition
  ? StyleV2ControlData
  : T extends TypographyControlDefinition
  ? TypographyControlData
  : never

export type GetItemLabelListControlItemData<T extends ListControlDefinition> = {
  id: string
  type?: T['config']['type']['type']
  value: GetItemLabelControlData<T['config']['type']>
}

export type GetItemLabelShapeControlData<T extends ShapeControlDefinition = ShapeControlDefinition> = {
  [K in keyof T['config']['type']]?: GetItemLabelControlData<T['config']['type'][K]>
}

export type GetItemListControlData<T extends ListControlDefinition = ListControlDefinition> =
  GetItemLabelListControlItemData<T>[]

export const ListControlType = 'makeswift::controls::list'

type ListControlConfig<T extends ControlDefinition = ControlDefinition> = {
  type: T
  label?: string
  getItemLabel?(item: GetItemLabelControlData<T> | undefined): string
}

export type ListControlDefinition<C extends ListControlConfig = ListControlConfig> = {
  type: typeof ListControlType
  config: C
}

export function List<T extends ControlDefinition, C extends ListControlConfig<T>>(
  config: C & { type: T },
): ListControlDefinition<C> {
  return { type: ListControlType, config }
}

export type ListControlItemData<T extends ListControlDefinition> = {
  id: string
  type?: T['config']['type']['type']
  value: ControlDefinitionData<T['config']['type']>
}

export type ListControlData<T extends ListControlDefinition = ListControlDefinition> =
  ListControlItemData<T>[]

export const ListControlMessageType = {
  LIST_CONTROL_ITEM_CONTROL_MESSAGE: 'makeswift::controls::list::message::item-control-message',
} as const

type ListControlItemControlMessage = {
  type: typeof ListControlMessageType.LIST_CONTROL_ITEM_CONTROL_MESSAGE
  payload: { message: PropControllerMessage; itemId: string }
}

export type ListControlMessage = ListControlItemControlMessage

export class ListControl<
  T extends ListControlDefinition = ListControlDefinition,
> extends PropController<ListControlMessage> {
  controls: Map<string, AnyPropController>
  descriptor: ListControlDefinition
  send: Send<ListControlMessage>

  constructor(send: Send<ListControlMessage>, descriptor: T) {
    super(send)

    this.descriptor = descriptor
    this.send = send

    this.controls = new Map<string, AnyPropController>()
  }

  setItemsControl = (value: ListControlData<T> | undefined) => {
    const controls = new Map<string, AnyPropController>()

    if (value == null) return

    const shouldUpdate = () => {
      // If the length is different, should update
      if (value.length !== this.controls.size) return true
      // If this.controls does not have an itemId, should update
      if (!value.every(({ id }) => this.controls.has(id))) return true

      return false
    }

    if (!shouldUpdate()) return this.controls

    value.forEach(item => {
      const control = createPropController(this.descriptor.config.type, message =>
        this.send({
          type: ListControlMessageType.LIST_CONTROL_ITEM_CONTROL_MESSAGE,
          payload: { message, itemId: item.id },
        }),
      )

      controls.set(item.id, control)
    })

    this.controls = controls

    return this.controls
  }

  recv = (message: ListControlMessage) => {
    switch (message.type) {
      case ListControlMessageType.LIST_CONTROL_ITEM_CONTROL_MESSAGE: {
        const control = this.controls.get(message.payload.itemId)

        if (control == null) return

        // TODO: We're casting the type here as the arg0 type for control.recv is never
        const recv = control.recv as (arg0: PropControllerMessage) => void

        recv(message.payload.message)
      }
    }
  }
}

export function copyListData(
  definition: ListControlDefinition,
  value: ListControlData | undefined,
  context: CopyContext,
): ListControlData | undefined {
  if (value == null) return value

  return (
    value &&
    value.map(item => ({
      ...item,
      value: controlCopy(definition.config.type, item.value, context),
    }))
  )
}

function introspectListData<T>(
  definition: ListControlDefinition,
  value: ListControlData | undefined,
  func: (definition: ControlDefinition, data: Data) => T[],
): T[] {
  if (value == null) return []

  return value.flatMap(item => func(definition.config.type, item.value))
}

export function getListElementChildren(definition: ListControlDefinition, value: ListControlData) {
  return introspectListData(definition, value, getElementChildren)
}

export function getListSwatchIds(definition: ListControlDefinition, value: ListControlData) {
  return introspectListData(definition, value, getSwatchIds)
}

export function getListFileIds(definition: ListControlDefinition, value: ListControlData) {
  return introspectListData(definition, value, getFileIds)
}

export function getListTypographyIds(definition: ListControlDefinition, value: ListControlData) {
  return introspectListData(definition, value, getTypographyIds)
}

export function getListPageIds(definition: ListControlDefinition, value: ListControlData) {
  return introspectListData(definition, value, getPageIds)
}

export function getListTranslatableData(definition: ListControlDefinition, data: ListControlData) {
  return Object.fromEntries(
    data.map(item => [item.id, getTranslatableData(definition.config.type, item.value)]),
  )
}

export type ListControlTranslationDto = Record<string, ListControlData>

export function mergeListTranslatedData(
  definition: ListControlDefinition,
  data: ListControlData,
  translatedData: ListControlTranslationDto,
  context: MergeTranslatableDataContext,
) {
  return data.map(item => {
    return {
      ...item,
      value: mergeTranslatedData(
        definition.config.type,
        item.value,
        translatedData[item.id],
        context,
      ),
    }
  })
}
