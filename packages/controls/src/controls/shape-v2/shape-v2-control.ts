import { ControlDefinition } from '../definition'
import {
  ControlInstance,
  type ControlMessage,
  type SendMessage,
} from '../instance'

import { ShapeV2Definition } from './shape-v2'

type Message = {
  type: typeof ShapeV2Control.CHILD_CONTROL_MESSAGE
  payload: { message: ControlMessage; key: string }
}

export class ShapeV2Control<
  Def extends ShapeV2Definition = ShapeV2Definition,
> extends ControlInstance<Message> {
  static readonly CHILD_CONTROL_MESSAGE =
    'makeswift::controls::shape-v2::message::child-control-message'

  private readonly childControls: Map<string, ControlInstance> = new Map()

  constructor(
    private readonly definition: Def,
    sendMessage: SendMessage<Message>,
  ) {
    super(sendMessage)
    this.childControls = new Map(
      Object.entries(this.definition.keyDefs).map(([key, def]) => [
        key,
        this.createChildControl(def, key),
      ]),
    )
  }

  recv = (message: Message) => {
    switch (message.type) {
      case ShapeV2Control.CHILD_CONTROL_MESSAGE: {
        this.child(message.payload.key)?.recv(message.payload.message)
      }
    }
  }

  child = (key: string) => this.childControls.get(key)

  createChildControl = (def: ControlDefinition, key: string) => {
    return def.createInstance((message) =>
      this.sendMessage({
        type: ShapeV2Control.CHILD_CONTROL_MESSAGE,
        payload: { message, key },
      }),
    )
  }
}
