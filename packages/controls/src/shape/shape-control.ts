import { DataType } from '../control-definition'
import {
  ControlInstance,
  type SendMessage,
  type ControlMessage,
} from '../control-instance'
import { ShapeDefinition } from './shape'

type Payload = { message: ControlMessage; key: string }

export class ShapeControl<
  Def extends ShapeDefinition = ShapeDefinition,
> extends ControlInstance<Payload> {
  static readonly messageType = {
    SHAPE_CONTROL_CHILD_CONTROL_MESSAGE:
      'makeswift::controls::shape::message::child-control-message',
  } as const

  private childControls: Map<string, ControlInstance> = new Map()

  constructor(
    private readonly definition: Def,
    sendMessage: SendMessage<Payload>,
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

  recv = (message: ControlMessage<Payload>) => {
    switch (message.type) {
      case ShapeControl.messageType.SHAPE_CONTROL_CHILD_CONTROL_MESSAGE: {
        const control = this.childControls.get(message.payload.key)
        control?.recv(message.payload.message)
      }
    }
  }

  createChildControl = (key: string) => {
    return this.definition.keyDefs[key].createInstance((message) =>
      this.sendMessage({
        type: ShapeControl.messageType.SHAPE_CONTROL_CHILD_CONTROL_MESSAGE,
        payload: { message, key },
      }),
    )
  }
}
