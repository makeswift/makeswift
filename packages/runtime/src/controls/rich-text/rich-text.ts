import { ReactNode } from 'react'
import {
  RichTextV1Definition,
  type SerializedRecord,
  type ResourceResolver,
  type Effector,
  type Resolvable,
  type DataType,
  SendMessage,
} from '@makeswift/controls'

import { RichTextControl } from './control'

abstract class BaseDefinition extends RichTextV1Definition<ReactNode, RichTextControl> {}

class Definition extends BaseDefinition {
  static deserialize(data: SerializedRecord): Definition {
    if (data.type !== Definition.type) {
      throw new Error(`RichTextV1: expected type ${Definition.type}, got ${data.type}`)
    }

    return new Definition()
  }

  resolveValue(
    _data: DataType<BaseDefinition> | undefined,
    _resolver: ResourceResolver,
    _effector: Effector,
    _control?: RichTextControl,
  ): Resolvable<ReactNode | undefined> {
    return {
      // FIXME
      readStableValue: (previous?: ReactNode) => previous,
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }

  createInstance(sendMessage: SendMessage<any>) {
    return new RichTextControl(sendMessage)
  }
}

export { Definition as RichTextV1Definition, RichTextControl as RichTextV1Control }
