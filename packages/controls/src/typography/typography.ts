import { z } from 'zod'

import { type ResolvedColorData } from '../common'

import { type CopyContext } from '../context'
import { type ResourceResolver } from '../resource-resolver'
import { type Effector } from '../effector'
import {
  IntrospectionTargetType,
  type IntrospectionTarget,
} from '../introspect'
import { DefaultControlInstance, type SendMessage } from '../control-instance'

import {
  ControlDefinition,
  safeParse,
  serialize,
  type ParseResult,
  type SerializedRecord,
  type Resolvable,
} from '../control-definition'

import { Color } from '../color'

import { notNil } from '../utils/functional'
import { getTypographySchema } from './schema'

type Config = z.infer<typeof Definition.schema.config>

type SchemaType<_C extends Config> = typeof Definition.schema

type DataType<C extends Config> = z.infer<SchemaType<C>['data']>
type ValueType<C extends Config> = z.infer<SchemaType<C>['value']>
type ResolvedValueType<C extends Config> = z.infer<
  SchemaType<C>['resolvedValue']
>

type InstanceType<_C extends Config> = DefaultControlInstance

class Definition<C extends Config = Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>,
  InstanceType<C>
> {
  static readonly type = 'makeswift::controls::typography' as const

  static get schema() {
    const type = z.literal(Definition.type)

    const config = z.object({})

    const data = getTypographySchema(
      z
        .object({
          swatchId: z.string().nullable(),
          alpha: z.number().nullable(),
        })
        .nullable(),
    )

    const resolvedData = getTypographySchema(
      z
        .object({
          swatch: z.object({
            hue: z.number().nullable(),
            saturation: z.number().nullable(),
            lightness: z.number().nullable(),
          }),
          alpha: z.number().nullable(),
        })
        .optional()
        .nullable(),
    )

    const value = data
    const resolvedValue = z.string()

    const definition = z.object({
      type,
    })

    return {
      type,
      config,
      definition,
      data,
      resolvedData,
      value,
      resolvedValue,
    }
  }

  static deserialize(data: SerializedRecord): Definition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Typography: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    Definition.schema.definition.parse(data)
    return new Definition({})
  }

  constructor(readonly config: C) {
    super(config)
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    return Definition.schema as SchemaType<C>
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    return this.schema.data.optional().parse(data)
  }

  toData(value: ValueType<C>): DataType<C> {
    return value
  }

  copyData(
    data: DataType<C> | undefined,
    context: CopyContext,
  ): DataType<C> | undefined {
    if (data == null) return data

    return {
      id:
        context.replacementContext.typographyIds.get(data.id ?? '') ?? data.id,
      style: data.style.map((override) => ({
        ...override,
        value: {
          ...override.value,
          color:
            override.value.color == null
              ? null
              : {
                  ...override.value.color,
                  alpha: override.value.color.alpha ?? null,
                  swatchId:
                    context.replacementContext.swatchIds.get(
                      override.value.color.swatchId ?? '',
                    ) ??
                    override.value.color.swatchId ??
                    null,
                },
        },
      })),
    }
  }

  resolveValue(
    data: DataType<C> | undefined,
    resolver: ResourceResolver,
    effector: Effector,
    _control?: InstanceType<C>,
  ): Resolvable<ResolvedValueType<C> | undefined> {
    const resolvedColors = new Map<
      string,
      Resolvable<ResolvedColorData | undefined>
    >(
      data?.style.flatMap((style) =>
        style.value.color?.swatchId
          ? [
              [
                style.value.color.swatchId,
                Color().resolveSwatch(
                  {
                    swatchId: style.value.color.swatchId,
                    alpha: style.value.color.alpha ?? 1,
                  },
                  resolver,
                ),
              ],
            ]
          : [],
      ),
    )

    const resolvedColor = (swatchId: string | undefined | null) =>
      swatchId ? resolvedColors.get(swatchId)?.readStableValue() : undefined

    const resolvedStyle = (data: DataType<C>) => {
      return data.style.map((typography) => {
        return {
          ...typography,
          value: {
            ...typography.value,
            color: resolvedColor(typography.value.color?.swatchId),
          },
        }
      })
    }

    return {
      readStableValue: (previous?: ResolvedValueType<C>) => {
        return data != null
          ? effector.computeClassName(previous, [], resolvedStyle(data))
          : undefined
      },

      subscribe: (onUpdate: () => void) => {
        const unsubscribes = [...resolvedColors.values()].map((v) =>
          v.subscribe(onUpdate),
        )

        return () => unsubscribes?.forEach((u) => u())
      },

      triggerResolve: async (currentValue?: ResolvedValueType<C>) => {
        if (data != null && currentValue != null) {
          effector.defineStyle(
            currentValue,
            [],
            resolvedStyle(data),
            // TODO: implement onBoxModelChange, if at all
            (_boxModel) => {},
          )
        }

        await Promise.all(
          [...resolvedColors.values()].map((r) => r.triggerResolve()),
        )
      },
    }
  }

  createInstance(sendMessage: SendMessage<any>) {
    return new DefaultControlInstance(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }

  introspect<R>(data: DataType<C> | undefined, target: IntrospectionTarget<R>) {
    if (data == null) return []

    if (target.type === IntrospectionTargetType.Swatch) {
      return (
        data.style.flatMap(
          (typography) => target.introspect(typography.value.color) ?? [],
        ) ?? []
      )
    }

    if (target.type === IntrospectionTargetType.Typography) {
      return [data.id].filter(notNil) as R[]
    }

    return []
  }
}

export const Typography = <C extends Config>() =>
  new (class Typography extends Definition<C> {})({} as C)

export type ResolvedTypographyData = z.infer<
  Definition['schema']['resolvedData']
>

export { Definition as unstable_TypographyDefinition }
