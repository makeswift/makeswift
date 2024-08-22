import { hasAllKeys } from '../../lib/functional'

import {
  ControlInstance,
  type ControlMessage,
  type SendMessage,
} from '../instance'

import { type ListDefinition } from './list'

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

  childControls = (ids: string[] | undefined) => {
    if (ids == null || hasAllKeys(this.itemControls, ids)) {
      return this.itemControls
    }

    return new Map(
      ids.map((id) => [id, this.child(id) ?? this.createItemControl(id)]),
    )
  }

  setChildControls = (children: Map<string, ControlInstance>) => {
    this.itemControls = children
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
