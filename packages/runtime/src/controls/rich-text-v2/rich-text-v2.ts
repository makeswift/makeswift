import { ReactNode } from 'react'
import { z } from 'zod'
// @ts-expect-error: there are no types for 'corporate-ipsum'
import ipsum from 'corporate-ipsum'

import {
  RichTextDefinition,
  type Data,
  type Resolvable,
  type SendMessage,
  type SerializedRecord,
  type SchemaType,
  type MergeTranslatableDataContext,
  type RichTextPluginControl,
  type ResourceResolver,
  type Effector,
  type RichTextMode,
  notNil,
} from '@makeswift/controls'

import { LinkPlugin } from '../../slate/LinkPlugin'
import { InlinePlugin } from '../../slate/InlinePlugin'
import { TextAlignPlugin } from '../../slate/TextAlignPlugin'
import { BlockPlugin } from '../../slate/BlockPlugin'
import { TypographyPlugin } from '../../slate/TypographyPlugin'
import { InlineModePlugin } from '../../slate/InlineModePlugin'

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

class Definition extends RichTextDefinition<ReactNode, Config, InstanceType> {
  constructor({ mode, defaultValue }: UserConfig) {
    super({
      mode,
      defaultValue: defaultValue ?? (mode === Definition.Mode.Inline ? 'Edit this text' : ipsum(3)),
      plugins:
        mode === Definition.Mode.Inline
          ? [InlineModePlugin()]
          : [BlockPlugin(), TypographyPlugin(), TextAlignPlugin(), InlinePlugin(), LinkPlugin()],
    })
  }

  static deserialize(data: SerializedRecord): Definition {
    if (data.type !== Definition.type) {
      throw new Error(`RichText: expected type ${Definition.type}, got ${data.type}`)
    }

    const { config: userConfig } = this.schema.definition.parse(data)
    return new Definition(userConfig)
  }

  static get configSchema(): SchemaType<Config> {
    return super.schema.userConfig.extend({
      defaultValue: z.string(),
      plugins: z.array(z.object({}) as SchemaType<RichTextV2Plugin>),
    })
  }

  createInstance(sendMessage: SendMessage): InstanceType {
    return new RichTextV2Control(sendMessage, this)
  }

  resolveValue(
    _data: DataType | undefined,
    _resolver: ResourceResolver,
    _effector: Effector,
    _control?: InstanceType,
  ): Resolvable<ReactNode | undefined> {
    return {
      // FIXME
      readStableValue: (previous?: ReactNode) => previous,
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }

  getTranslatableData(data: DataType): Data {
    // FIXME
    //    if (isRichTextV1Data(richTextData)) return null

    return getTranslatableData(Definition.dataToNodes(data), this.config.plugins)
  }

  mergeTranslatedData(
    data: DataType,
    translatedData: Data,
    _context: MergeTranslatableDataContext,
  ): Data {
    if (translatedData == null) return data as Data

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

  get pluginControls(): RichTextPluginControl[] {
    return this.config.plugins.map(plugin => plugin.control).filter(notNil)
  }

  pluginControlAt(index: number): RichTextPluginControl | undefined {
    return this.pluginControls[index]
  }
}

export const RichText = (config?: UserConfig) =>
  new (class RichTextV2Definition extends Definition {})(config ?? {})

RichText.Mode = Definition.Mode
RichText.isV1Data = Definition.isV1Data
RichText.dataToNodes = Definition.dataToNodes
RichText.Plugin = Plugin
// RichText.descendentsToData = Definition.descendentsToData

export {
  Definition as RichTextV2Definition,
  RichTextMode as RichTextV2Mode,
  type DataV2Type as RichTextDataV2,
  RichTextV2Control,
}
