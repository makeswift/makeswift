import {
  AnyPropController,
  createPropController,
  PropController,
  PropControllerMessage,
} from '../prop-controllers/instances'
import { CopyContext } from '../state/react-page'
import { ControlDefinition, ControlDefinitionData } from './control'

import { copy as controlCopy } from './control'

export const ListControlType = 'makeswift::controls::list'

type ListControlConfig<T extends ControlDefinition = ControlDefinition> = {
  type: T
  label?: string
  /**
   * @todos
   * - Make `item` the control's transformed "value" instead of "data."
   */
  getItemLabel?(item: ControlDefinitionData<T> | undefined): string
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
  type: T['config']['type']['type']
  value: ControlDefinitionData<T['config']['type']>
}

export type ListControlData<T extends ListControlDefinition = ListControlDefinition> =
  ListControlItemData<T>[]

export const ListControlMessageType = {
  LIST_CONTROL_ITEM_CONTROL_MESSAGE:
    'makeswift::controls::lists::message::list-control-item-control-message',
  LIST_CONTROL_UPDATE_CHILDREN_CONTROLS:
    'makeswift::controls::lists::message::update-children-controls-message',
} as const

type ListControlItemControlMessage = {
  type: typeof ListControlMessageType.LIST_CONTROL_ITEM_CONTROL_MESSAGE
  payload: { message: PropControllerMessage; itemId: string }
}

type ListControlUpdateChildrenControlsMessage = {
  type: typeof ListControlMessageType.LIST_CONTROL_UPDATE_CHILDREN_CONTROLS
  payload: { value: any }
}

export type ListControlMessage =
  | ListControlItemControlMessage
  | ListControlUpdateChildrenControlsMessage

export class ListControl extends PropController<ListControlMessage> {
  controls: Map<string, AnyPropController>
  descriptor: ListControlDefinition
  send: any
  listeners: Array<() => void>

  constructor(send: any, descriptor: ListControlDefinition, prop: any) {
    super(send)

    this.descriptor = descriptor
    this.send = send
    this.controls = new Map<string, AnyPropController>()
    this.listeners = []

    this.setChildrenControls(prop)
  }

  recv = (message: ListControlMessage) => {
    console.log({ message })
    switch (message.type) {
      case ListControlMessageType.LIST_CONTROL_UPDATE_CHILDREN_CONTROLS:
        this.setChildrenControls(message.payload.value)
    }
  }

  setChildrenControls = (value: any) => {
    const controls = new Map<string, AnyPropController>()

    value?.forEach((item: any) => {
      const control = createPropController(
        this.descriptor.config.type,
        message =>
          this.send({
            type: ListControlMessageType.LIST_CONTROL_ITEM_CONTROL_MESSAGE,
            payload: { message, itemId: item.id },
          }),
        item.value,
      )

      controls.set(item.id, control)
    })

    this.controls = controls

    this.emitChange()
  }

  subscribe = (listener: () => void) => {
    console.log({ listeners: this.listeners })
    this.listeners = [...this.listeners, listener]

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  emitChange = () => {
    for (let listener of this.listeners) {
      listener()
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
