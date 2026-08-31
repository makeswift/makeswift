import {
  ControlDefinition,
  SerializedRecord,
  serializeObject,
  SerializationPlugin,
  ControlSerializationVisitor,
} from '@makeswift/controls'

import { RichTextV2Definition } from '../../rich-text-v2'

export class BaseControlSerializationVisitor extends ControlSerializationVisitor {
  constructor(plugins: SerializationPlugin<any>[]) {
    const serializeDefinitionPlugin: SerializationPlugin<ControlDefinition> = {
      match: (val: unknown) => val instanceof ControlDefinition,
      serialize: (val: ControlDefinition) => val.accept(this),
    }

    super([serializeDefinitionPlugin, ...plugins])
  }

  visitRichTextV2(def: RichTextV2Definition): SerializedRecord {
    // serialize only the plugin control definition, if any
    const pluginDefs = def.plugins.map(({ control }) =>
      control
        ? {
            control: {
              definition: control.definition,
              // FIXME: remove getValue/onChange stubs once we released a version of the builder
              // built against the runtime where these can be optional
              getValue: () => undefined,
              onChange: () => {},
            },
          }
        : {},
    )

    const serialized = serializeObject(
      // Continue serializing plugins as part of the config for the time being
      // for builder compatibility; the current runtime accept plugins either in
      // the config or at the definition level -- see `RichTextV2Definition.fullSchema`
      { config: { ...def.config, plugins: pluginDefs } },
      this.serializationPlugins,
    ) as SerializedRecord

    return { ...serialized, type: RichTextV2Definition.type }
  }
}
