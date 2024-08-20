import { z } from 'zod'

import { type SerializedRecord } from '../../../serialization'
import { type DataType } from '../../associated-types'
import { serialize } from '../../definition'
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
  createInstance(sendMessage: SendMessage<any>): ControlInstance<any> {
    return new DefaultControlInstance(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
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
