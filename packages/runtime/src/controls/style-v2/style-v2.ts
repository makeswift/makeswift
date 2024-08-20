import {
  ControlDefinition,
  SerializationSchema,
  StyleV2Definition as BaseStyleV2Definition,
  StyleV2PropDefinition,
  StyleV2Control,
  type StyleV2Config,
  type DeserializedRecord,
} from '@makeswift/controls'

import { CSSObject } from '@emotion/serialize'

type PropDefinition = StyleV2PropDefinition
type Config<Prop extends PropDefinition> = StyleV2Config<Prop, CSSObject>

export class StyleV2Definition<
  Prop extends PropDefinition = PropDefinition,
> extends BaseStyleV2Definition<Prop, CSSObject> {
  static deserialize(
    data: DeserializedRecord,
    deserializeCallback: (r: DeserializedRecord) => ControlDefinition,
  ): StyleV2Definition {
    if (data.type !== StyleV2Definition.type) {
      throw new Error(`StyleV2: expected type ${StyleV2Definition.type}, got ${data.type}`)
    }

    const {
      config: { type, ...config },
    } = StyleV2Definition.schema({
      typeDef: SerializationSchema.deserializedRecord,
    }).definition.parse(data)

    const typeDef = deserializeCallback(type)

    return unstable_StyleV2({ type: typeDef, ...config })
  }
}

export function unstable_StyleV2<Prop extends PropDefinition>(
  config: Config<Prop>,
): StyleV2Definition<Prop> {
  return new StyleV2Definition(config)
}

export { StyleV2Control }
