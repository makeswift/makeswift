import { match } from 'ts-pattern'
import { z } from 'zod'

import { ControlDataTypeKey, colorDataSchema } from '../common'
import { type CopyContext } from '../context'
import {
  type ResourceResolver,
  type ValueSubscription,
} from '../resource-resolver'

import {
  DefaultControlInstance,
  ControlInstance,
  type SendType,
} from '../control-instance'

import {
  ControlDefinition,
  safeParse,
  serialize,
  type ParseResult,
} from '../control-definition'

import { swatchToColorString } from './conversion'

type Config = z.infer<typeof Definition.schema.relaxed.config>

type DataSchemaType<C extends Config> = undefined extends C['defaultValue']
  ? typeof Definition.schema.relaxed
  : typeof Definition.schema.strict

type DataType<C extends Config> = z.infer<DataSchemaType<C>['data']>
type ValueType<C extends Config> = z.infer<DataSchemaType<C>['value']>
type ResolvedValueType<C extends Config> = z.infer<
  DataSchemaType<C>['resolvedValue']
>

class Definition<C extends Config = Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>
> {
  private static readonly v1DataType = 'color::v1' as const
  private static readonly dataSignature = {
    v1: { [ControlDataTypeKey]: this.v1DataType },
  } as const

  static readonly type = 'makeswift::controls::color' as const

  static get schema() {
    const type = z.literal(this.type)
    const version = z.literal(1).optional()
    const value = colorDataSchema

    const schemas = <R>(resolvedValue: z.ZodType<R>) => {
      const data = value.and(
        z.object({
          [ControlDataTypeKey]: z.literal(this.v1DataType).optional(),
        }),
      )

      const config = z.object({
        label: z.string().optional(),
        labelOrientation: z
          .union([z.literal('horizontal'), z.literal('vertical')])
          .optional(),
        defaultValue: resolvedValue,
        hideAlpha: z.boolean().optional(),
      })

      const definition = z.object({
        type,
        config,
        version,
      })

      return { type, value, resolvedValue, data, config, version, definition }
    }

    return {
      version,
      relaxed: schemas(z.string().optional()),
      strict: schemas(z.string()),
    }
  }

  static deserialize(data: unknown): Definition {
    const { config, version } = this.schema.relaxed.definition.parse(data)
    return new Definition(config, version)
  }

  constructor(
    config: C,
    readonly version: z.infer<typeof Definition.schema.version>,
  ) {
    super(config)
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    return (
      this.config.defaultValue === undefined
        ? Definition.schema.relaxed
        : Definition.schema.strict
    ) as DataSchemaType<C>
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    const inputSchema = this.schema.data.optional()
    return match(data satisfies z.infer<typeof inputSchema>)
      .with(Definition.dataSignature.v1, ({ swatchId, alpha }) => ({
        swatchId,
        alpha,
      }))
      .otherwise((value) => value)
  }

  toData(value: ValueType<C>): DataType<C> {
    return match(this.version)
      .with(1, () => ({
        ...Definition.dataSignature.v1,
        ...value,
      }))
      .with(undefined, () => value)
      .exhaustive()
  }

  copyData(
    data: DataType<C> | undefined,
    { replacementContext }: CopyContext,
  ): DataType<C> | undefined {
    if (data == null) return data

    const replaceSwatchId = (swatchId: string) =>
      replacementContext.swatchIds.get(swatchId) ?? swatchId

    const inputSchema = this.schema.data.optional()
    return match(data satisfies z.infer<typeof inputSchema>)
      .with(Definition.dataSignature.v1, (val) => ({
        ...val,
        swatchId: replaceSwatchId(val.swatchId),
      }))
      .otherwise((val) => ({
        ...val,
        swatchId: replaceSwatchId(val.swatchId),
      }))
  }

  resolveValue(
    value: ValueType<C>,
    resolver: ResourceResolver,
  ): ValueSubscription<ResolvedValueType<C>> {
    const swatchSubscription = resolver.subscribeSwatch(value?.swatchId)

    if (value?.swatchId != null && swatchSubscription.readValue() == null) {
      resolver.fetchSwatch(value.swatchId).catch(console.error)
    }

    return {
      readValue: () =>
        swatchToColorString(
          swatchSubscription.readValue(),
          value?.alpha ?? 1,
          this.config.defaultValue,
        ),
      subscribe: swatchSubscription.subscribe,
    }
  }

  createInstance(send: SendType<ControlInstance>): ControlInstance {
    return new DefaultControlInstance(send)
  }

  serialize(): [unknown, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
      version: this.version,
    })
  }

  getSwatchIds(data: DataType<C> | undefined): string[] {
    return data?.swatchId == null ? [] : [data.swatchId]
  }
}

export const Color = <C extends Config>(config?: C) =>
  new (class Color extends Definition<C> {})(config ?? ({} as C), 1)

export { Definition as ColorDefinition }
