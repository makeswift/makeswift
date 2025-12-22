import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import { safeParse, type ParseResult } from '../../../lib/zod'

import { type CopyContext } from '../../../context'
import { type IntrospectionTarget } from '../../../introspection'
import { ControlDefinition, type SchemaType } from '../../definition'
import { ControlInstance } from '../../instance'
import { ControlDefinitionVisitor } from '../../visitor'

import { DTOSchema, isRichTextDTO, richTextDTOtoDAO } from '../dto'
import * as Slate from '../slate'

import { copyNodes } from './copy'
import { introspectNodes } from './introspection'
import { RichTextPluginControl } from './plugin'

type UserConfig = z.infer<typeof Definition.schema.userConfig>
type DataV1Type = z.infer<typeof Definition.schema.dataV1>
type DataV2Type = z.infer<typeof Definition.schema.dataV2>
type DataType = z.infer<typeof Definition.schema.data>
type ValueType = z.infer<typeof Definition.schema.value>

abstract class Definition<
  RuntimeNode,
  Config extends UserConfig = UserConfig,
  InstanceType extends ControlInstance<any> = ControlInstance<any>,
> extends ControlDefinition<
  typeof Definition.type,
  Config,
  DataType,
  ValueType,
  RuntimeNode,
  InstanceType
> {
  static readonly type = 'makeswift::controls::rich-text-v2' as const
  static readonly Mode = {
    Inline: `${this.type}::mode::inline`,
    Block: `${this.type}::mode::block`,
  } as const

  static get schema() {
    const type = z.literal(this.type)
    const version = z.literal(2)

    const dataV1 = DTOSchema.valueJSON
    const dataV2 = z.object({
      type,
      version,
      descendants: z.array<SchemaType<Slate.Descendant>>(z.any()),
      key: z.string(),
    })

    const data = z.union([dataV1, dataV2])
    const value = dataV2

    const userConfig = z.object({
      mode: z.optional(
        z.union([z.literal(this.Mode.Inline), z.literal(this.Mode.Block)]),
      ),
      defaultValue: z.optional(z.string()),
    })

    return {
      type,
      data,
      dataV1,
      dataV2,
      value,
      userConfig,
    }
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    const baseSchema = Definition.schema
    const definition = z.object({
      type: baseSchema.type,
      config: this.configSchema,
    })

    return {
      ...baseSchema,
      definition,
      resolvedValue: this.nodeSchema,
    }
  }

  get configSchema(): SchemaType<Config> {
    return z.any()
  }

  get nodeSchema(): SchemaType<RuntimeNode> {
    return z.any()
  }

  safeParse(data: unknown | undefined): ParseResult<DataType | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType | undefined): ValueType | undefined {
    return data !== undefined ? Definition.normalizeData(data) : undefined
  }

  toData(value: ValueType): DataType {
    return value
  }

  copyData(
    data: DataType | undefined,
    context: CopyContext,
  ): DataType | undefined {
    if (data == null) return data

    const nodes = Definition.dataToNodes(data)
    return Definition.nodesToDataV2(copyNodes(nodes, context))
  }

  introspect<R>(
    data: DataType | undefined,
    target: IntrospectionTarget<R>,
  ): R[] {
    if (data == null) return []

    const nodes = Definition.dataToNodes(data)
    return introspectNodes(nodes, target, this.pluginControls)
  }

  accept<R>(visitor: ControlDefinitionVisitor<R>, ...args: unknown[]): R {
    return visitor.visitRichTextV2(this, ...args)
  }

  static isV1Data(data: DataType | undefined): data is DataV1Type {
    return isRichTextDTO(data)
  }

  static dataToNodes(data: DataType): Slate.Descendant[] {
    return Definition.isV1Data(data) ? richTextDTOtoDAO(data) : data.descendants
  }

  static nodesToDataV2(
    descendants: Slate.Descendant[],
    key?: string,
  ): DataV2Type {
    return {
      type: Definition.type,
      version: 2,
      descendants,
      key: key ?? uuid(),
    }
  }

  static normalizeData(data: DataType): DataV2Type {
    return Definition.isV1Data(data)
      ? Definition.nodesToDataV2(richTextDTOtoDAO(data))
      : data
  }

  abstract toText(data: DataType | undefined): string
  abstract get pluginControls(): RichTextPluginControl[]
  abstract pluginControlAt(index: number): RichTextPluginControl | undefined
}

export { Definition as RichTextDefinition }

export type RichTextTypography = Slate.Typography
export type RichTextMode =
  (typeof Definition.Mode)[keyof typeof Definition.Mode]
