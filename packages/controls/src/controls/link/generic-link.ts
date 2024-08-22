import { type DeserializedRecord } from '../../serialization'

import { LinkDefinition } from './link'

class Definition extends LinkDefinition {
  static deserialize(data: DeserializedRecord): GenericLinkDefinition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Link: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { config } = Definition.schema.definition.parse(data)
    return new GenericLinkDefinition(config)
  }
}

export class GenericLinkDefinition extends Definition {}

export const GenericLink = (config?: { label?: string }) =>
  new GenericLinkDefinition(config ?? {})
