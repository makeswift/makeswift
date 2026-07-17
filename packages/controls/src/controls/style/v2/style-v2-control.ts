import { type BoxDisplayModel } from '../../../common'
import { ControlDefinition } from '../../definition'
import {
  ControlInstance,
  ControlMessage,
  type ControlInstanceArgs,
} from '../../instance'

type ItemBoxModelChangeMessage = {
  type: typeof StyleV2Control.CHANGE_BOX_MODEL
  payload: { boxModel: BoxDisplayModel | null }
}

type ChildControlMessage = {
  type: typeof StyleV2Control.CHILD_CONTROL_MESSAGE
  payload: { message: ControlMessage }
}

type Message = ItemBoxModelChangeMessage | ChildControlMessage

export class StyleV2Control extends ControlInstance<Message> {
  static readonly CHANGE_BOX_MODEL =
    'makeswift::controls::style::message::change-box-model'
  static readonly CHILD_CONTROL_MESSAGE =
    'makeswift::controls::style-v2::message::child-control-message'

  private readonly control: ControlInstance

  constructor(propDef: ControlDefinition, args: ControlInstanceArgs<Message>) {
    super(args)
    this.control = propDef.createInstance({
      ...args,
      sendMessage: (message) =>
        this.sendMessage({
          type: StyleV2Control.CHILD_CONTROL_MESSAGE,
          payload: { message },
        }),
    })
  }

  child(_key?: string): ControlInstance | undefined {
    return this.control
  }

  recv = (message: Message) => {
    switch (message.type) {
      case StyleV2Control.CHILD_CONTROL_MESSAGE: {
        if (this.control == null) return
        this.control.recv(message.payload.message)
      }
    }
  }

  resolvesToRenderableNode(): boolean {
    return false
  }

  changeBoxModel(boxModel: BoxDisplayModel | null): void {
    this.sendMessage({
      type: StyleV2Control.CHANGE_BOX_MODEL,
      payload: { boxModel },
    })
  }
}
