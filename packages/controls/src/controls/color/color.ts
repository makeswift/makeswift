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
import {
  ResourceSchema,
  toColorDataV2,
  toLegacyColorData,
  type ColorDataV2,
} from '../../resources'
import { type ResourceResolver } from '../../resources/resolver'
import { type DeserializedRecord } from '../../serialization'

import {
  ControlDefinition,
  type Resolvable,
  type SchemaType,
} from '../definition'
import { DefaultControlInstance, type ControlInstanceArgs } from '../instance'
import { ControlDefinitionVisitor } from '../visitor'

import {
  hslToColorString,
  safeColorString,
  swatchToColorString,
} from './conversion'

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
  private static readonly v2DataType = 'color::v2' as const
  private static readonly dataSignature = {
    v1: { [ControlDataTypeKey]: this.v1DataType },
    v2: { [ControlDataTypeKey]: this.v2DataType },
  } as const

  static readonly type = 'makeswift::controls::color' as const

  static get schema() {
    const type = z.literal(this.type)
    const version = z.union([z.literal(1), z.literal(2)]).optional()
    const value = ResourceSchema.colorDataV2
    const resolvedSwatchValue = ResourceSchema.resolvedColorData

    const schemas = <R>(resolvedValue: SchemaType<R>) => {
      const v1DataType = z.object({
        [ControlDataTypeKey]: z.literal(this.v1DataType).optional(),
      })
      const v2DataType = z.object({
        [ControlDataTypeKey]: z.literal(this.v2DataType),
      })
      const data = z.union([
        z.discriminatedUnion('type', [
          ResourceSchema.swatchColorData.merge(v2DataType),
          ResourceSchema.inlineColorData.merge(v2DataType),
        ]),
        ResourceSchema.colorData.merge(v1DataType),
      ])

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
      .with(undefined, () => undefined)
      .with(
        Definition.dataSignature.v2,
        ({ [ControlDataTypeKey]: _, ...value }) => value,
      )
      .otherwise((data) => toColorDataV2(data))
  }

  toData(value: ValueType<C>): DataType<C> {
    const colorValue: ColorDataV2 = value

    return match(this.version)
      .with(2, () => ({
        ...Definition.dataSignature.v2,
        ...colorValue,
      }))
      .with(1, () => ({
        ...Definition.dataSignature.v1,
        ...toLegacyColorData(colorValue),
      }))
      .with(undefined, () => toLegacyColorData(colorValue))
      .exhaustive()
  }

  copyData(
    data: DataType<C> | undefined,
    ctx: CopyContext,
  ): DataType<C> | undefined {
    if (data == null) return data

    const inputSchema = this.dataSchema
    return match(data satisfies z.infer<typeof inputSchema>)
      .with({ type: 'inline' }, (inline) => inline)
      .otherwise((swatch) => {
        if (
          shouldRemoveResource(ContextResource.Swatch, swatch.swatchId, ctx)
        ) {
          return undefined
        }

        return {
          ...swatch,
          swatchId: replaceResourceIfNeeded(
            ContextResource.Swatch,
            swatch.swatchId,
            ctx,
          ),
        }
      })
  }

  resolveSwatch(
    data: DataType<C> | undefined,
    resolver: ResourceResolver,
  ): Resolvable<ResolvedSwatchValueType<C> | undefined> {
    const value = this.fromData(data)

    const swatchSub = resolver.resolveSwatch(
      value?.type === 'swatch' ? value.swatchId : undefined,
    )

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

  resolveValueFromData(): undefined {
    return undefined
  }

  resolveValue(
    data: DataType<C> | undefined,
    resolver: ResourceResolver,
  ): Resolvable<ResolvedValueType<C> | undefined> {
    const value = this.fromData(data)
    const swatch = resolver.resolveSwatch(
      value?.type === 'swatch' ? value.swatchId : undefined,
    )

    const stableValue = StableValue({
      name: Definition.type,
      read: () =>
        value?.type === 'inline'
          ? hslToColorString(value, value.alpha)
          : swatchToColorString(
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

  createInstance(args: ControlInstanceArgs) {
    return new DefaultControlInstance(args)
  }

  accept<R>(visitor: ControlDefinitionVisitor<R>, ...args: unknown[]): R {
    return visitor.visitColor(this, ...args)
  }
}

export class ColorDefinition<C extends Config = Config> extends Definition<C> {}

type ColorDefaultValueInput =
  | string
  | { color: string; opacity: number }
  | undefined

type UserConfig<D extends ColorDefaultValueInput = undefined> = Omit<
  Config,
  'defaultValue'
> & {
  defaultValue?: D
}

type NormalizedDefaultValue<D extends ColorDefaultValueInput> =
  D extends undefined ? undefined : string

type NormedConfig<D extends ColorDefaultValueInput> = z.infer<
  SchemaByDefaultValue<NormalizedDefaultValue<D>>['config']
>

function normalizeDefaultValue(
  defaultValue: ColorDefaultValueInput,
): Config['defaultValue'] {
  if (defaultValue == null || typeof defaultValue === 'string')
    return defaultValue

  return safeColorString(defaultValue.color, defaultValue.opacity)
}

function normalizeConfig<D extends ColorDefaultValueInput>(
  config: UserConfig<D>,
) {
  const { defaultValue, ...rest } = config
  return defaultValue == null
    ? config
    : { ...rest, defaultValue: normalizeDefaultValue(defaultValue) }
}

export function Color<D extends ColorDefaultValueInput = undefined>(
  config?: UserConfig<D>,
): ColorDefinition<NormedConfig<D>> {
  return new ColorDefinition<NormedConfig<D>>(
    config ? normalizeConfig(config) : {},
    2,
  )
}
