import { z } from 'zod'

import { type ResolvedColorData } from '../common'

import { type CopyContext } from '../context'
import { type ResourceResolver } from '../resource-resolver'
import { type Effector } from '../effector'
import { Targets, type IntrospectionTarget } from '../introspect'
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

import * as Schema from './schema'

type SchemaType = typeof Definition.schema
type DataType = z.infer<SchemaType['data']>
type ValueType = z.infer<SchemaType['value']>
type ResolvedValueType = z.infer<SchemaType['resolvedValue']>
type InstanceType = DefaultControlInstance

class Definition extends ControlDefinition<
  typeof Definition.type,
  unknown,
  DataType,
  ValueType,
  ResolvedValueType,
  InstanceType
> {
  static readonly type = 'makeswift::controls::typography' as const

  static get schema() {
    const type = z.literal(Definition.type)

    const data = Schema.typography(
      z
        .object({
          swatchId: z.string().nullable(),
          alpha: z.number().nullable(),
        })
        .nullable(),
    )

    const resolvedData = Schema.typography(
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
    return new Definition()
  }

  constructor() {
    super({})
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    return Definition.schema
  }

  safeParse(data: unknown | undefined): ParseResult<DataType | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType | undefined): ValueType | undefined {
    return this.schema.data.optional().parse(data)
  }

  toData(value: ValueType): DataType {
    return value
  }

  copyData(
    data: DataType | undefined,
    context: CopyContext,
  ): DataType | undefined {
    if (data == null) return data

    return {
      id:
        context.replacementContext.typographyIds.get(data.id ?? '') ?? data.id,
      style: data.style.map((override) => ({
        ...override,
        value: {
          ...override.value,
          // FIXME: Color().copyData ??
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
    data: DataType | undefined,
    resolver: ResourceResolver,
    effector: Effector,
    _control?: InstanceType,
  ): Resolvable<ResolvedValueType | undefined> {
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

    const resolvedStyle = (data: DataType) => {
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
      readStableValue: (previous?: ResolvedValueType) => {
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

      triggerResolve: async (currentValue?: ResolvedValueType) => {
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

  createInstance(sendMessage: SendMessage) {
    return new DefaultControlInstance(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }

  introspect<R>(data: DataType | undefined, target: IntrospectionTarget<R>) {
    if (data == null) return []

    if (target.type === Targets.Swatch.type) {
      return (
        data.style.flatMap(
          (typography) => target.introspect(typography.value.color) ?? [],
        ) ?? []
      )
    }

    if (target.type === Targets.Typography.type) {
      return [data.id].filter(notNil) as R[]
    }

    return []
  }
}

export const unstable_Typography = () =>
  new (class Typography extends Definition {})()

export { Definition as unstable_TypographyDefinition }
