import { type BoxModel } from '../common'
// import { ControlDefinition } from '../control-definition'
import {
  ControlInstance,
  ControlMessage,
  SendMessage,
} from '../control-instance'
import { StyleV2Definition } from './style-v2'

type ItemBoxModelChangeMessage = {
  type: typeof StyleV2Control.CHANGE_BOX_MODEL
  payload: { boxModel: BoxModel | null }
}

type ChildControlMessage = {
  type: typeof StyleV2Control.CHILD_CONTROL_MESSAGE
  payload: { message: ControlMessage }
}

type Message = ItemBoxModelChangeMessage | ChildControlMessage

export class StyleV2Control<
  RuntimeStylesObject,
  Def extends
    StyleV2Definition<RuntimeStylesObject> = StyleV2Definition<RuntimeStylesObject>,
> extends ControlInstance<Message> {
  static readonly CHANGE_BOX_MODEL =
    'makeswift::controls::style::message::change-box-model'
  static readonly CHILD_CONTROL_MESSAGE =
    'makeswift::controls::style-v2::message::child-control-message'

  private control?: ControlInstance

  constructor(
    private readonly definition: Def,
    sendMessage: SendMessage<Message>,
  ) {
    super(sendMessage)
    this.control = this.definition.typeDef.createInstance((message) =>
      this.sendMessage({
        type: StyleV2Control.CHILD_CONTROL_MESSAGE,
        payload: { message },
      }),
    )
  }

  getChildControl() {
    return this.control
  }

  child(_key?: string): ControlInstance | undefined {
    return this.control
  }

  recv = (message: Message) => {
    switch (message.type) {
      case StyleV2Control.CHILD_CONTROL_MESSAGE: {
        // const control = this.control

        if (this.control == null) return

        // const recv = control.recv as (arg0: ControlMessage) => void

        // recv(message.payload.message)
        // console.log(this.control)
        this.control.recv(message.payload.message)
      }
    }
  }

  changeBoxModel(boxModel: BoxModel | null): void {
    this.sendMessage({
      type: StyleV2Control.CHANGE_BOX_MODEL,
      payload: { boxModel },
    })
  }
}
