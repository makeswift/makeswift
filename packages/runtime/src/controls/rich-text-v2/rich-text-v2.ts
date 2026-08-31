import { ReactNode } from 'react'
import { z } from 'zod'
// @ts-expect-error: there are no types for 'corporate-ipsum'
import ipsum from 'corporate-ipsum'

import {
  RichTextDefinition as BaseRichTextDefinition,
  isNotNil,
  ControlDefinition,
  SerializationSchema,
  StableValue,
  type Data,
  type Resolvable,
  type ControlInstanceArgs,
  type DeserializedRecord,
  type SchemaType,
  type SchemaTypeAny,
  type RichTextPluginControl,
  type ResourceResolver,
  type Stylesheet,
  type RichTextMode,
} from '@makeswift/controls'

import { LinkPlugin } from '../../slate/LinkPlugin'
import { InlinePlugin } from '../../slate/InlinePlugin'
import { TextAlignPlugin } from '../../slate/TextAlignPlugin'
import { BlockPlugin } from '../../slate/BlockPlugin'
import { TypographyPlugin } from '../../slate/TypographyPlugin'
import { InlineModePlugin } from '../../slate/InlineModePlugin'
import { toText } from '../../slate/utils'

import { renderRichTextV2 } from '../../runtimes/react/controls/rich-text-v2'

import { RichTextV2Plugin, Plugin } from './plugin'
import { RichTextV2Control } from './control'
import { getTranslatableData } from './translations/get-translations'

type DataType = z.infer<typeof Definition.schema.data>
type DataV2Type = z.infer<typeof Definition.schema.dataV2>
type InstanceType = RichTextV2Control
type UserConfig = z.infer<typeof Definition.schema.userConfig>
type Config = UserConfig & {
  defaultValue: string
}

class Definition extends BaseRichTextDefinition<ReactNode, Config, InstanceType> {
  readonly plugins: RichTextV2Plugin[]

  constructor({ mode, defaultValue }: UserConfig, plugins?: RichTextV2Plugin[]) {
    super({
      mode,
      defaultValue:
        defaultValue ??
        (mode === Definition.Mode.Inline ? 'Edit this text' : Definition.generateParagraph()),
    })

    // The built-in plugin set is currently determined entirely by `mode` and
    // has remained stable across runtime versions, so it does not need to be
    // stored in the internal config. When that changes, we should:
    //  - introduce a plugin registry
    //  - have the config carry the IDs of selected plugins
    //  - use the current inline and block plugin sets as defaults when
    //    deserializing a legacy config that does not include plugin IDs
    this.plugins =
      plugins ??
      (mode === Definition.Mode.Inline
        ? [InlineModePlugin()]
        : [BlockPlugin(), TypographyPlugin(), TextAlignPlugin(), InlinePlugin(), LinkPlugin()])
  }

  static generateParagraph(): string {
    return ipsum(3)
  }

  static deserialize(
    data: DeserializedRecord,
    deserializeCallback: (r: DeserializedRecord) => ControlDefinition,
  ): RichTextV2Definition {
    if (data.type !== Definition.type) {
      throw new Error(`RichText: expected type ${Definition.type}, got ${data.type}`)
    }

    const { config, plugins } = Definition.fullSchema({
      pluginDef: SerializationSchema.deserializedRecord,
    }).definition.parse(data)

    const { plugins: configPlugins, ...userConfig } = config

    return new RichTextV2Definition(
      userConfig,
      (plugins ?? configPlugins ?? []).map(({ control }) =>
        control ? { control: { definition: deserializeCallback(control?.definition) } } : {},
      ),
    )
  }

  static fullSchema<S extends SchemaTypeAny>({ pluginDef }: { pluginDef: S }) {
    const baseSchema = super.schema
    const plugin = z.object({
      control: z
        .object({
          definition: pluginDef,
        })
        .optional(),
    })

    const plugins = z.array(plugin)

    const config = Definition.configSchema().extend({
      // plugins have been moved from config to the definition itself; keeping
      // the field here as optional so we can deserialize definitions coming from
      // older runtimes
      plugins: plugins.optional(),
    })

    return {
      ...baseSchema,
      config,
      definition: z.object({
        type: baseSchema.type,
        // marked as optional for backward compatibility with older runtimes
        plugins: plugins.optional(),
        config,
      }),
    }
  }

  static configSchema() {
    return super.schema.userConfig.extend({
      defaultValue: z.string(),
    })
  }

  get configSchema(): SchemaType<Config> {
    return Definition.configSchema()
  }

  createInstance(args: ControlInstanceArgs) {
    return new RichTextV2Control(this, args)
  }

  resolveValue(
    data: DataType | undefined,
    _resolver: ResourceResolver,
    _stylesheet: Stylesheet,
    control?: InstanceType,
  ): Resolvable<ReactNode | undefined> {
    const stableValue = StableValue({
      name: Definition.type,
      read: () => renderRichTextV2({ data, config: this.config, control: control ?? null }),
    })

    return {
      ...stableValue,
      triggerResolve: async () => {},
    }
  }

  getTranslatableData(data: DataType | undefined): Data {
    if (data == null) return null
    return getTranslatableData(Definition.dataToNodes(data), this.plugins)
  }

  get pluginControls(): RichTextPluginControl[] {
    return this.plugins.map(plugin => plugin.control).filter(isNotNil)
  }

  pluginControlAt(index: number): RichTextPluginControl | undefined {
    return this.pluginControls[index]
  }

  toText(data: DataType | undefined): string {
    if (data == null) return ''
    return toText(Definition.dataToNodes(data), this.config.mode ?? Definition.Mode.Block)
  }
}

export class RichTextV2Definition extends Definition {}

export function RichText(config?: UserConfig): RichTextV2Definition {
  return new RichTextV2Definition(config ?? {})
}

RichText.Mode = Definition.Mode
RichText.isV1Data = Definition.isV1Data
RichText.dataToNodes = Definition.dataToNodes
RichText.Plugin = Plugin

export { RichTextMode as RichTextV2Mode, type DataV2Type as RichTextDataV2, RichTextV2Control }
