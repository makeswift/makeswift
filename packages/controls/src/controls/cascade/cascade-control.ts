import { ControlDefinition } from '../definition'
import {
  ControlInstance,
  type ControlMessage,
  type SendMessage,
} from '../instance'

import { type CascadeDefinition } from './cascade'

type Message = {
  type: typeof CascadeControl.CHILD_CONTROL_MESSAGE
  payload: { message: ControlMessage; key: string }
}

export class CascadeControl<
  Def extends CascadeDefinition = CascadeDefinition,
> extends ControlInstance<Message> {
  static readonly CHILD_CONTROL_MESSAGE =
    'makeswift::controls::cascade::message::child-control-message'

  private readonly childControls: Map<string, ControlInstance> = new Map()

  constructor(
    private readonly definition: Def,
    sendMessage: SendMessage<Message>,
  ) {
    super(sendMessage)
    // Only step 0 is statically known (it takes no upstream value). Downstream
    // step controls are materialized dynamically from upstream selections by
    // the builder — deferred with the serialization protocol — so they are not
    // wired here.
    const step0 = this.definition.steps[0]?.()
    if (step0 != null) {
      this.childControls.set('0', this.createChildControl(step0, '0'))
    }
  }

  recv = (message: Message) => {
    switch (message.type) {
      case CascadeControl.CHILD_CONTROL_MESSAGE: {
        this.child(message.payload.key)?.recv(message.payload.message)
      }
    }
  }

  child = (key: string) => this.childControls.get(key)

  createChildControl = (def: ControlDefinition, key: string) => {
    return def.createInstance((message) =>
      this.sendMessage({
        type: CascadeControl.CHILD_CONTROL_MESSAGE,
        payload: { message, key },
      }),
    )
  }
}
