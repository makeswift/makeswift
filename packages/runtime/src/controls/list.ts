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
} as const

type ListControItemControlMessage = {
  type: typeof ListControlMessageType.LIST_CONTROL_ITEM_CONTROL_MESSAGE
  payload: { message: PropControllerMessage; itemId: string }
}

export type ListControlMessage = ListControItemControlMessage

export class ListControl extends PropController<ListControlMessage> {
  controls: Map<string, AnyPropController>

  constructor(send: any, descriptor: ListControlDefinition, prop) {
    super(send)

    const controls = new Map<string, AnyPropController>()

    prop?.forEach(item => {
      const control = createPropController(
        descriptor.config.type,
        message =>
          send({
            type: ListControlMessageType.LIST_CONTROL_ITEM_CONTROL_MESSAGE,
            payload: { message, itemId: item.id },
          }),
        item.value,
      )

      controls.set(item.id, control)
    })

    this.controls = controls
  }

  recv(): void {}
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
