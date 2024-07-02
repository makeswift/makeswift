import { DataType } from '../control-definition'
import {
  ControlInstance,
  type SendMessage,
  type ControlMessage,
} from '../control-instance'
import { ShapeDefinition } from './shape'

type Message = {
  type: typeof ShapeControl.CHILD_CONTROL_MESSAGE
  payload: { message: ControlMessage; key: string }
}

export class ShapeControl<
  Def extends ShapeDefinition = ShapeDefinition,
> extends ControlInstance<Message> {
  static CHILD_CONTROL_MESSAGE =
    'makeswift::controls::shape::message::child-control-message'

  private childControls: Map<string, ControlInstance> = new Map()

  constructor(
    private readonly definition: Def,
    sendMessage: SendMessage<Message>,
  ) {
    super(sendMessage)
  }

  setControls = (data: DataType<Def> | undefined) => {
    if (data == null) return

    const shouldUpdate = () => {
      const dataKeys = Object.keys(data)

      if (dataKeys.length !== this.childControls.size) return true

      if (!dataKeys.every((key) => this.childControls.has(key))) return true

      return false
    }

    if (!shouldUpdate()) return this.childControls

    return (this.childControls = new Map(
      Object.entries(data).map(([key]) => [key, this.createChildControl(key)]),
    ))
  }

  recv = (message: Message) => {
    switch (message.type) {
      case ShapeControl.CHILD_CONTROL_MESSAGE: {
        this.child(message.payload.key)?.recv(message.payload.message)
      }
    }
  }

  child = (key: string) => this.childControls.get(key)

  createChildControl = (key: string) => {
    return this.definition.keyDefs[key].createInstance((message) =>
      this.sendMessage({
        type: ShapeControl.CHILD_CONTROL_MESSAGE,
        payload: { message, key },
      }),
    )
  }
}
