import { ControlDefinition } from '../definition'
import {
  ControlInstance,
  type ControlInstanceArgs,
  type ControlMessage,
} from '../instance'

import { type GroupDefinition } from './group'

type Message = {
  type: typeof GroupControl.CHILD_CONTROL_MESSAGE
  payload: { message: ControlMessage; key: string }
}

export class GroupControl<
  Def extends GroupDefinition = GroupDefinition,
> extends ControlInstance<Message> {
  static readonly CHILD_CONTROL_MESSAGE =
    'makeswift::controls::group::message::child-control-message'

  private readonly childControls: Map<string, ControlInstance> = new Map()

  constructor(
    private readonly definition: Def,
    args: ControlInstanceArgs,
  ) {
    super(args)
    this.childControls = new Map(
      Object.entries(this.definition.propDefs).map(([key, def]) => [
        key,
        this.createChildControl(def, key),
      ]),
    )
  }

  recv = (message: Message) => {
    switch (message.type) {
      case GroupControl.CHILD_CONTROL_MESSAGE: {
        this.child(message.payload.key)?.recv(message.payload.message)
      }
    }
  }

  child = (key: string) => this.childControls.get(key)

  resolvesToRenderableNode = () => false

  createChildControl = (def: ControlDefinition, key: string) => {
    const { elementKey, propPath } = this.instanceKey
    return def.createInstance({
      instanceKey: {
        elementKey,
        propPath: `${propPath}.${key}`,
      },
      sendMessage: (message) =>
        this.sendMessage({
          type: GroupControl.CHILD_CONTROL_MESSAGE,
          payload: { message, key },
        }),
    })
  }
}
