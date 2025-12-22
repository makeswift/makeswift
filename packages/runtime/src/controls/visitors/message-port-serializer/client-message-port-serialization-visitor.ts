import {
  AnyFunction,
  ControlDefinition,
  SerializedRecord,
  serializeObject,
  SerializationPlugin,
  ControlSerializationVisitor,
  isFunction,
} from '@makeswift/controls'

import { RichTextV2Definition } from '../../rich-text-v2'

import { serializeFunction } from './function-serialization'

export class ClientMessagePortSerializationVisitor extends ControlSerializationVisitor {
  private transferables: Transferable[] = []

  constructor() {
    const serializeFunctionPlugin: SerializationPlugin<AnyFunction> = {
      match: isFunction,
      serialize: (val: AnyFunction) => {
        const r = serializeFunction(val)
        this.transferables.push(r)
        return r
      },
    }

    const serializeDefinitionPlugin: SerializationPlugin<ControlDefinition> = {
      match: (val: unknown) => val instanceof ControlDefinition,
      serialize: (val: ControlDefinition) => val.accept(this),
    }

    super([serializeFunctionPlugin, serializeDefinitionPlugin])
  }

  getTransferables(): Transferable[] {
    return [...this.transferables]
  }

  visitRichTextV2(def: RichTextV2Definition): SerializedRecord {
    const { plugins, ...config } = def.config

    // serialize only the plugin control definition, if any
    const pluginDefs = plugins.map(({ control }) =>
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
      { config: { ...config, plugins: pluginDefs } },
      this.serializationPlugins,
    ) as SerializedRecord

    return { ...serialized, type: RichTextV2Definition.type }
  }
}
