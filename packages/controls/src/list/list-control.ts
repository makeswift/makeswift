import { type DataType } from '../control-definition'
import {
  ControlInstance,
  type ControlMessage,
  type SendMessage,
} from '../control-instance'

import { type ListDefinition } from './list'

type Message = {
  type: typeof ListControl.ITEM_CONTROL_MESSAGE
  payload: { message: ControlMessage; itemId: string }
}

export class ListControl<
  Def extends ListDefinition = ListDefinition,
> extends ControlInstance<Message> {
  static ITEM_CONTROL_MESSAGE =
    'makeswift::controls::list::message::item-control-message'

  private itemControls: Map<string, ControlInstance> = new Map()

  constructor(
    private readonly definition: Def,
    sendMessage: SendMessage<Message>,
  ) {
    super(sendMessage)
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
      case ListControl.ITEM_CONTROL_MESSAGE: {
        this.child(message.payload.itemId)?.recv(message.payload.message)
      }
    }
  }

  child = (key: string) => this.itemControls.get(key)

  createItemControl = (id: string) => {
    return this.definition.itemDef.createInstance((message) =>
      this.sendMessage({
        type: ListControl.ITEM_CONTROL_MESSAGE,
        payload: { message, itemId: id },
      }),
    )
  }
}
