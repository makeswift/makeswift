import { match } from 'ts-pattern'
import { z } from 'zod'

import { StableValue } from '../../lib/stable-value'
import { safeParse, type ParseResult } from '../../lib/zod'

import { ControlDataTypeKey } from '../../common'
import {
  ContextResource,
  replaceResourceIfNeeded,
  shouldRemoveResource,
  type CopyContext,
} from '../../context'
import { ResourceSchema } from '../../resources'
import { type ResourceResolver } from '../../resources/resolver'
import {
  type DeserializedRecord,
  type SerializedRecord,
} from '../../serialization'

import {
  ControlDefinition,
  serialize,
  type Resolvable,
  type SchemaType,
} from '../definition'
import { DefaultControlInstance, type SendMessage } from '../instance'
import { ControlDefinitionVisitor } from '../visitor'

import { swatchToColorString } from './conversion'

type Config = z.infer<typeof Definition.schema.relaxed.config>

type SchemaByDefaultValue<D extends Config['defaultValue']> =
  undefined extends D
    ? typeof Definition.schema.relaxed
    : typeof Definition.schema.strict

type Schema<C extends Config> = SchemaByDefaultValue<C['defaultValue']>
type DataType<C extends Config> = z.infer<Schema<C>['data']>
type ValueType<C extends Config> = z.infer<Schema<C>['value']>
type ResolvedValueType<C extends Config> = z.infer<Schema<C>['resolvedValue']>

type ResolvedSwatchValueType<C extends Config> = z.infer<
  Schema<C>['resolvedSwatchValue']
>

type ReturnedSchemaType<C extends Config> = {
  definition: typeof Definition.schema.relaxed.definition
  type: typeof Definition.schema.relaxed.type
  data: SchemaType<DataType<C>>
  value: SchemaType<ValueType<C>>
  resolvedValue: SchemaType<ResolvedValueType<C>>
}

class Definition<C extends Config> extends ControlDefinition<
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
    const value = ResourceSchema.colorData
    const resolvedSwatchValue = ResourceSchema.resolvedColorData

    const schemas = <R>(resolvedValue: SchemaType<R>) => {
      const data = value.merge(
        z.object({
          [ControlDataTypeKey]: z.literal(this.v1DataType).optional(),
        }),
      )

      const config = z.object({
        label: z.string().optional(),
        labelOrientation: z
          .union([z.literal('horizontal'), z.literal('vertical')])
          .optional(),
        description: z.string().optional(),
        defaultValue: resolvedValue,
        hideAlpha: z.boolean().optional(),
      })

      const definition = z.object({
        type,
        config,
        version,
      })

      return {
        type,
        value,
        resolvedSwatchValue,
        resolvedValue,
        data,
        config,
        version,
        definition,
      }
    }

    return {
      version,
      relaxed: schemas(z.string().optional()),
      strict: schemas(z.string()),
    }
  }

  static deserialize(data: DeserializedRecord): ColorDefinition {
    if (data.type !== Definition.type)
      throw new Error(
        `Color deserialization: expected '${Definition.type}', got '${data.type}'`,
      )

    const { config, version } = Definition.schema.relaxed.definition.parse(data)
    return new ColorDefinition(config, version)
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

  get schema(): ReturnedSchemaType<C> {
    return Definition.schema.relaxed
  }

  get dataSchema() {
    return (
      (this.config.defaultValue === undefined
        ? Definition.schema.relaxed
        : Definition.schema.strict) as Schema<C>
    ).data
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.dataSchema, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    const inputSchema = this.dataSchema.optional()
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
    ctx: CopyContext,
  ): DataType<C> | undefined {
    if (data == null) return data

    const currentSwatchId = data.swatchId
    if (shouldRemoveResource(ContextResource.Swatch, currentSwatchId, ctx)) {
      return undefined
    }

    const inputSchema = this.dataSchema.optional()
    return match(data satisfies z.infer<typeof inputSchema>)
      .with(Definition.dataSignature.v1, (val) => ({
        ...val,
        swatchId: replaceResourceIfNeeded(
          ContextResource.Swatch,
          val.swatchId,
          ctx,
        ),
      }))
      .otherwise((val) => ({
        ...val,
        swatchId: replaceResourceIfNeeded(
          ContextResource.Swatch,
          val.swatchId,
          ctx,
        ),
      }))
  }

  resolveSwatch(
    data: DataType<C> | undefined,
    resolver: ResourceResolver,
  ): Resolvable<ResolvedSwatchValueType<C> | undefined> {
    const value = this.fromData(data)
    const swatchSub = resolver.resolveSwatch(value?.swatchId)

    const stableValue = StableValue({
      name: `${Definition.type}:swatch`,
      read: () => {
        const swatch = swatchSub.readStable()
        return swatch == null
          ? undefined
          : {
              swatch,
              alpha: value?.alpha ?? 1,
            }
      },
      deps: [swatchSub],
    })

    return {
      ...stableValue,
      triggerResolve: async (currentValue?: ResolvedSwatchValueType<C>) => {
        if (currentValue == null) {
          await swatchSub.fetch()
        }
      },
    }
  }

  resolveValue(
    data: DataType<C> | undefined,
    resolver: ResourceResolver,
  ): Resolvable<ResolvedValueType<C> | undefined> {
    const value = this.fromData(data)
    const swatch = resolver.resolveSwatch(value?.swatchId)

    const stableValue = StableValue({
      name: Definition.type,
      read: () =>
        swatchToColorString(
          swatch.readStable(),
          value?.alpha ?? 1,
          this.config.defaultValue,
        ),
      deps: [swatch],
    })

    return {
      ...stableValue,
      triggerResolve: async () => {
        if (swatch.readStable() == null) {
          await swatch.fetch()
        }
      },
    }
  }

  createInstance(sendMessage: SendMessage<any>) {
    return new DefaultControlInstance(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
      version: this.version,
    })
  }

  accept<R>(visitor: ControlDefinitionVisitor<R>, ...args: unknown[]): R {
    return visitor.visitColor(this, ...args)
  }
}

export class ColorDefinition<C extends Config = Config> extends Definition<C> {}

type UserConfig<D extends Config['defaultValue']> = Config & {
  defaultValue?: D
}

type NormedConfig<D extends Config['defaultValue']> = z.infer<
  SchemaByDefaultValue<D>['config']
>

export function Color<D extends Config['defaultValue']>(
  config?: UserConfig<D>,
): ColorDefinition<NormedConfig<D>> {
  return new ColorDefinition<NormedConfig<D>>(config ?? {}, 1)
}
