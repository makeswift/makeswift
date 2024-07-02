import { type DataType } from '../control-definition'
import {
  ControlInstance,
  type ControlMessage,
  type SendMessage,
} from '../control-instance'

import { type ListDefinition } from './list'
import { hasAllKeys } from '../utils/functional'

type Message = {
  type: typeof ListControl.ITEM_CONTROL_MESSAGE
  payload: { message: ControlMessage; itemId: string }
}

export class ListControl<
  Def extends ListDefinition = ListDefinition,
> extends ControlInstance<Message> {
  static readonly ITEM_CONTROL_MESSAGE =
    'makeswift::controls::list::message::item-control-message'

  private itemControls: Map<string, ControlInstance> = new Map()

  constructor(
    private readonly definition: Def,
    sendMessage: SendMessage<Message>,
  ) {
    super(sendMessage)
  }

  recv = (message: Message) => {
    switch (message.type) {
      case ListControl.ITEM_CONTROL_MESSAGE: {
        this.child(message.payload.itemId)?.recv(message.payload.message)
      }
    }
  }

  child = (key: string) => this.itemControls.get(key)

  update = (data: DataType<Def> | undefined) => {
    if (
      data == null ||
      hasAllKeys(
        this.itemControls,
        data.map(({ id }) => id),
      )
    ) {
      return
    }

    this.itemControls = new Map(
      data.map(({ id }) => [id, this.createItemControl(id)]),
    )
  }

  createItemControl = (id: string) => {
    return this.definition.itemDef.createInstance((message) =>
      this.sendMessage({
        type: ListControl.ITEM_CONTROL_MESSAGE,
        payload: { message, itemId: id },
      }),
    )
  }
}
