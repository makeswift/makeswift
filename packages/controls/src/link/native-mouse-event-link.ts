import { type SerializedRecord } from '../control-definition'
import { LinkDefinition } from './link'

/**
 * Dummy link class parameterized by the native MouseEvent type. This class is
 * solely for testing. The runtime exports a similar class, but parameterized by
 * the React synthetic event type.
 */
class Definition extends LinkDefinition<MouseEvent> {
  static deserialize(data: SerializedRecord): Definition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Link: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { config } = Definition.schema.definition.parse(data)
    return new Definition(config)
  }
}

export const NativeLink = (config?: { label?: string }) =>
  new (class Link extends Definition {})(config ?? {})
