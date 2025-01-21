import { ControlDefinition } from '../../definition'
import {
  ControlInstance,
  type ControlMessage,
  type SendMessage,
} from '../../instance'

import { ShapeDefinition } from './shape'

type Message = {
  type: typeof ShapeControl.CHILD_CONTROL_MESSAGE
  payload: { message: ControlMessage; key: string }
}

export class ShapeControl<
  Def extends ShapeDefinition = ShapeDefinition,
> extends ControlInstance<Message> {
  static readonly CHILD_CONTROL_MESSAGE =
    'makeswift::controls::shape::message::child-control-message'

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
      case ShapeControl.CHILD_CONTROL_MESSAGE: {
        this.child(message.payload.key)?.recv(message.payload.message)
      }
    }
  }

  child = (key: string) => this.childControls.get(key)

  createChildControl = (def: ControlDefinition, key: string) => {
    return def.createInstance((message) =>
      this.sendMessage({
        type: ShapeControl.CHILD_CONTROL_MESSAGE,
        payload: { message, key },
      }),
    )
  }
}
