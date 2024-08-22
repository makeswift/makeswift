import { type MouseEvent } from 'react'
import { type DeserializedRecord, LinkDefinition as BaseLinkDefinition } from '@makeswift/controls'

export class LinkDefinition extends BaseLinkDefinition<MouseEvent<Element>> {
  static deserialize(data: DeserializedRecord): LinkDefinition {
    if (data.type !== LinkDefinition.type) {
      throw new Error(`Link: expected type ${LinkDefinition.type}, got ${data.type}`)
    }

    const { config } = LinkDefinition.schema.definition.parse(data)
    return Link(config)
  }
}

export function Link(config?: { label?: string }): LinkDefinition {
  return new LinkDefinition(config ?? {})
}
