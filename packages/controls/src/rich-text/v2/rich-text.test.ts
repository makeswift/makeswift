import { type DataType, type Resolvable } from '../../control-definition'
import { type ResourceResolver } from '../../resource-resolver'
import { type Effector } from '../../effector'
// import { createReplacementContext } from '../../context'
import {
  type SendMessage,
  DefaultControlInstance,
} from '../../control-instance'

import { RichTextDefinition } from './rich-text'
import { RichTextPluginControl } from './plugin'

class Definition extends RichTextDefinition<string> {
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

  createInstance(sendMessage: SendMessage<any>) {
    return new DefaultControlInstance(sendMessage)
  }

  get pluginControls(): RichTextPluginControl[] {
    return []
  }

  pluginControlAt(_index: number) {
    return undefined
  }
}

export const RichText = () => new Definition({})

describe('RichText v2', () => {
  const definition = RichText()

  describe('copyData', () => {
    test('replaces the swatch, typography and page ids', () => {
      // FIXME
      console.log(definition.config)
    })
  })
})
