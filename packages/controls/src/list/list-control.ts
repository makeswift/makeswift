import { type DataType } from '../control-definition'
import {
  ControlInstance,
  type ControlMessage,
  type Send,
} from '../control-instance'

import { type ListDefinition } from './list'

type Message = {
  type: typeof ListControl.messageType.ITEM_CONTROL_MESSAGE
  payload: { message: ControlMessage; itemId: string }
}

export class ListControl<
  Def extends ListDefinition = ListDefinition,
> extends ControlInstance<Message> {
  static readonly messageType = {
    ITEM_CONTROL_MESSAGE:
      'makeswift::controls::list::message::item-control-message',
  } as const

  private itemControls: Map<string, ControlInstance> = new Map()

  constructor(
    private readonly definition: Def,
    send: Send<Message>,
  ) {
    super(send)
  }

  setItemsControl = (data: DataType<Def> | undefined) => {
    if (data == null) return

    const shouldUpdate = () => {
      // If the length is different, should update
      if (data.length !== this.itemControls.size) return true
      // If this.controls does not have an itemId, should update
      if (!data.every(({ id }) => this.itemControls.has(id))) return true

      return false
    }

    if (!shouldUpdate()) return this.itemControls

    return (this.itemControls = new Map(
      data.map(({ id }) => [id, this.createItemControl(id)]),
    ))
  }

  recv = (message: Message) => {
    switch (message.type) {
      case ListControl.messageType.ITEM_CONTROL_MESSAGE: {
        const control = this.itemControls.get(message.payload.itemId)
        control?.recv(message.payload.message)
      }
    }
  }

  createItemControl = (id: string) => {
    return this.definition.itemDef.createInstance((message) =>
      this.send({
        type: ListControl.messageType.ITEM_CONTROL_MESSAGE,
        payload: { message, itemId: id },
      }),
    )
  }
}
