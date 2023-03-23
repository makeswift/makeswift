import {
  AnyPropController,
  createPropController,
  PropController,
  PropControllerMessage,
  Send,
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

  recv() {}
}

export type ListControlData<T extends ListControlDefinition = ListControlDefinition> =
  ListControlItemData<T>[]

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
