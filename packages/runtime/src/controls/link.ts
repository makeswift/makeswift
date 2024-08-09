import { type MouseEvent } from 'react'
import { type SerializedRecord, LinkDefinition } from '@makeswift/controls'

class Definition extends LinkDefinition<MouseEvent> {
  static deserialize(data: SerializedRecord): Definition {
    if (data.type !== Definition.type) {
      throw new Error(`Link: expected type ${Definition.type}, got ${data.type}`)
    }

    const { config } = Definition.schema.definition.parse(data)
    return new Definition(config)
  }
}

export const Link = (config?: { label?: string }) =>
  new (class Link extends Definition {})(config ?? {})

export { Definition as LinkDefinition }
