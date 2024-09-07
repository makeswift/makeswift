import { ReactNode } from 'react'
import {
  RichTextV1Definition,
  SendMessage,
  StableValue,
  type DeserializedRecord,
  type ResourceResolver,
  type Stylesheet,
  type Resolvable,
  type DataType,
} from '@makeswift/controls'

import { renderRichText } from '../../runtimes/react/controls/rich-text'

import { RichTextControl } from './control'

abstract class BaseDefinition extends RichTextV1Definition<ReactNode, RichTextControl> {}

class Definition extends BaseDefinition {
  static deserialize(data: DeserializedRecord): Definition {
    if (data.type !== Definition.type) {
      throw new Error(`RichTextV1: expected type ${Definition.type}, got ${data.type}`)
    }

    return new (class RichTextV1 extends Definition {})()
  }

  resolveValue(
    data: DataType<BaseDefinition> | undefined,
    _resolver: ResourceResolver,
    _stylesheet: Stylesheet,
    control?: RichTextControl,
  ): Resolvable<ReactNode | undefined> {
    const stableValue = StableValue({
      name: Definition.type,
      read: () => renderRichText(data, control ?? null),
    })

    return {
      ...stableValue,
      triggerResolve: async () => {},
    }
  }

  createInstance(sendMessage: SendMessage<any>) {
    return new RichTextControl(sendMessage)
  }
}

export { Definition as RichTextV1Definition, RichTextControl as RichTextV1Control }
