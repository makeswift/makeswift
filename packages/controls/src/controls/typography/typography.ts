import { z } from 'zod'

import { isNotNil } from '../../lib/functional'
import { safeParse, type ParseResult } from '../../lib/zod'

import { type CopyContext } from '../../context'
import { Targets, type IntrospectionTarget } from '../../introspection'
import {
  type DeserializedRecord,
  type SerializedRecord,
} from '../../serialization'

import { ControlDefinition, serialize } from '../definition'
import { DefaultControlInstance, type SendMessage } from '../instance'

import * as Schema from './schema'

type Schema = typeof Definition.schema
type DataType = z.infer<Schema['data']>
type ValueType = z.infer<Schema['value']>
type ResolvedValueType = z.infer<Schema['resolvedValue']>
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
          swatch: z
            .object({
              hue: z.number().nullable(),
              saturation: z.number().nullable(),
              lightness: z.number().nullable(),
            })
            .nullable()
            .optional(),
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

  static deserialize(data: DeserializedRecord): Definition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Typography: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    Definition.schema.definition.parse(data)
    return new (class Typography extends Definition {})()
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
          ...(override.value.color == null
            ? {}
            : {
                // Can't use Color().copyData() here as typography's color
                // definition accepts null for swatchId and alpha, while Color
                // Data does not.
                color: {
                  ...override.value.color,
                  alpha: override.value.color.alpha ?? null,
                  swatchId:
                    context.replacementContext.swatchIds.get(
                      override.value.color.swatchId ?? '',
                    ) ??
                    override.value.color.swatchId ??
                    null,
                },
              }),
        },
      })),
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
      return [data.id].filter(isNotNil) as R[]
    }

    return []
  }
}

export class unstable_TypographyDefinition extends Definition {}

export function unstable_Typography(): unstable_TypographyDefinition {
  return new unstable_TypographyDefinition()
}
