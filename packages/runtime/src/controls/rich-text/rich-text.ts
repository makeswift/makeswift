import { ReactNode } from 'react'
import { RichTextV1Definition, type DeserializedRecord, SendMessage } from '@makeswift/controls'

import { RichTextControl } from './control'

abstract class BaseDefinition extends RichTextV1Definition<ReactNode, RichTextControl> {}

class Definition extends BaseDefinition {
  static deserialize(data: DeserializedRecord): Definition {
    if (data.type !== Definition.type) {
      throw new Error(`RichTextV1: expected type ${Definition.type}, got ${data.type}`)
    }

    return new (class RichTextV1 extends Definition {})()
  }

  createInstance(sendMessage: SendMessage<any>) {
    return new RichTextControl(sendMessage)
  }
}

export { Definition as RichTextV1Definition, RichTextControl as RichTextV1Control }
