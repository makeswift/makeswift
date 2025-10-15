import { z } from 'zod'

import { type DataType } from '../../associated-types'
import { type Resolvable } from '../../definition'
import {
  ControlInstance,
  DefaultControlInstance,
  type SendMessage,
} from '../../instance'

import { RichTextPluginControl } from './plugin'
import { RichTextDefinition } from './rich-text'

export const renderedNode = Symbol('rendered node')

export type RenderedNode = typeof renderedNode

type UserConfig = z.infer<typeof Definition.schema.userConfig>

class Definition extends RichTextDefinition<RenderedNode> {
  resolveValue(
    _data: DataType<RichTextDefinition<RenderedNode>> | undefined,
  ): Resolvable<RenderedNode | undefined> {
    return {
      name: Definition.type,
      readStable: () => renderedNode,
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }

  createInstance(sendMessage: SendMessage<any>): ControlInstance<any> {
    return new DefaultControlInstance(sendMessage)
  }

  toText(_data: DataType<RichTextDefinition<string>>): string {
    return ''
  }

  get pluginControls(): RichTextPluginControl[] {
    return []
  }

  pluginControlAt(_index: number) {
    return undefined
  }
}

export { Definition as RichTextDefinition }

export const RichText = (config?: UserConfig) => new Definition(config ?? {})

RichText.Mode = Definition.Mode
