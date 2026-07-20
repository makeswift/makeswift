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

type InnerControlMessage = {
  type: typeof StyleV2Control.INNER_CONTROL_MESSAGE
  payload: { message: ControlMessage }
}

type Message = ItemBoxModelChangeMessage | InnerControlMessage

export class StyleV2Control extends ControlInstance<Message> {
  static readonly CHANGE_BOX_MODEL =
    'makeswift::controls::style::message::change-box-model'
  static readonly INNER_CONTROL_MESSAGE =
    'makeswift::controls::style-v2::message::inner-control-message'

  readonly inner: ControlInstance

  constructor(typeDef: ControlDefinition, args: ControlInstanceArgs<Message>) {
    super(args)
    this.inner = typeDef.createInstance({
      ...args,
      sendMessage: (message) =>
        this.sendMessage({
          type: StyleV2Control.INNER_CONTROL_MESSAGE,
          payload: { message },
        }),
    })
  }

  isCompositeProp(): boolean {
    return false
  }

  children(): ControlInstance[] {
    return []
  }

  child(_key: string): ControlInstance | undefined {
    return undefined
  }

  recv = (message: Message) => {
    switch (message.type) {
      case StyleV2Control.INNER_CONTROL_MESSAGE: {
        if (this.inner == null) return
        this.inner.recv(message.payload.message)
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
