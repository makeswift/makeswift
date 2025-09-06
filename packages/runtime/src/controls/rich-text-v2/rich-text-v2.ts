import { ReactNode } from 'react'
import { z } from 'zod'
// @ts-expect-error: there are no types for 'corporate-ipsum'
import ipsum from 'corporate-ipsum'

import {
  RichTextDefinition as BaseRichTextDefinition,
  isNotNil,
  ControlDefinition,
  SerializationSchema,
  serialize,
  StableValue,
  type Data,
  type Resolvable,
  type SendMessage,
  type SerializedRecord,
  type DeserializedRecord,
  type SchemaType,
  type SchemaTypeAny,
  type MergeTranslatableDataContext,
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
import {
  getTranslatableData,
  mergeTranslatedNodes,
  type RichTextTranslationDto,
} from './translation'

type DataType = z.infer<typeof Definition.schema.data>
type DataV2Type = z.infer<typeof Definition.schema.dataV2>
type InstanceType = RichTextV2Control
type UserConfig = z.infer<typeof Definition.schema.userConfig>
type Config = UserConfig & {
  defaultValue: string
  plugins: RichTextV2Plugin[]
}

class Definition extends BaseRichTextDefinition<ReactNode, Config, InstanceType> {
  constructor({ mode, defaultValue }: UserConfig, plugins?: RichTextV2Plugin[]) {
    super({
      mode,
      defaultValue:
        defaultValue ??
        (mode === Definition.Mode.Inline ? 'Edit this text' : Definition.generateParagraph()),
      plugins:
        plugins ??
        (mode === Definition.Mode.Inline
          ? [InlineModePlugin()]
          : [BlockPlugin(), TypographyPlugin(), TextAlignPlugin(), InlinePlugin(), LinkPlugin()]),
    })
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

    const { config } = Definition.fullSchema({
      pluginDef: SerializationSchema.deserializedRecord,
    }).definition.parse(data)

    const { plugins, ...userConfig } = config

    return new RichTextV2Definition(
      userConfig,
      plugins.map(({ control }) =>
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

    const config = baseSchema.userConfig.extend({
      defaultValue: z.string(),
      plugins: z.array(plugin),
    })

    return {
      ...baseSchema,
      config,
      definition: z.object({
        type: baseSchema.type,
        config,
      }),
    }
  }

  get configSchema(): SchemaType<Config> {
    return Definition.fullSchema({ pluginDef: z.any() as SchemaType<ControlDefinition> }).config
  }

  createInstance(sendMessage: SendMessage): InstanceType {
    return new RichTextV2Control(sendMessage, this)
  }

  resolveValue(
    data: DataType | undefined,
    _resolver: ResourceResolver,
    _stylesheet: Stylesheet,
    control?: InstanceType,
  ): Resolvable<ReactNode | undefined> {
    const stableValue = StableValue({
      name: Definition.type,
      read: () => renderRichTextV2(data, this, control ?? null),
    })

    return {
      ...stableValue,
      triggerResolve: async () => {},
    }
  }

  getTranslatableData(data: DataType | undefined): Data {
    if (data == null) return null
    return getTranslatableData(Definition.dataToNodes(data), this.config.plugins)
  }

  mergeTranslatedData(
    data: DataType | undefined,
    translatedData: Data,
    _context: MergeTranslatableDataContext,
  ): Data {
    if (data == null || translatedData == null) return data as Data

    const { descendants, ...rest } = Definition.normalizeData(data)
    return {
      ...rest,
      descendants: mergeTranslatedNodes(
        descendants,
        translatedData as RichTextTranslationDto,
        this.config.plugins,
      ),
    }
  }

  serialize(): [SerializedRecord, Transferable[]] {
    const { plugins, ...config } = this.config

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

    return serialize(
      { ...config, plugins: pluginDefs },
      {
        type: Definition.type,
      },
    )
  }

  get pluginControls(): RichTextPluginControl[] {
    return this.config.plugins.map(plugin => plugin.control).filter(isNotNil)
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
