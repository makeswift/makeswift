import { z } from 'zod'
import {
  type DataType,
  type Resolvable,
  // type SerializedRecord,
} from '../../control-definition'
import { type ResourceResolver } from '../../resource-resolver'
import { type Effector } from '../../effector'
import {
  type SendMessage,
  ControlInstance,
  DefaultControlInstance,
} from '../../control-instance'

import { RichTextDefinition } from './rich-text'
import { RichTextPluginControl } from './plugin'

class Definition extends RichTextDefinition<string> {
  // static deserialize(data: SerializedRecord): Definition {
  //   if (data.type !== Definition.type) {
  //     throw new Error(
  //       `RichText: expected type ${Definition.type}, got ${data.type}`,
  //     )
  //   }

  //   const { config: userConfig } = this.schema.definition.parse(data)
  //   return new Definition(userConfig)
  // }

  resolveValue(
    data: DataType<RichTextDefinition<string>> | undefined,
    _resolver: ResourceResolver,
    _effector: Effector,
  ): Resolvable<string | undefined> {
    return {
      readStableValue: () => JSON.stringify(data),
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }

  get schema() {
    const baseSchema = Definition.schema
    return {
      ...baseSchema,
      resolvedValue: z.any(),
    }
  }

  createInstance(sendMessage: SendMessage<any>): ControlInstance<any> {
    return new DefaultControlInstance(sendMessage)
  }

  get pluginControls(): RichTextPluginControl[] {
    return []
  }

  pluginControlAt(_index: number) {
    return undefined
  }
}

export { Definition as RichTextDefinition }
export const RichText = () => new Definition({})
