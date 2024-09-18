import { z } from 'zod'

import { isNotNil, mapValues } from '../../lib/functional'
import { StableValue } from '../../lib/stable-value'
import { safeParse, type ParseResult } from '../../lib/zod'

import { type ResolvedColorData } from '../../common'
import { type CopyContext } from '../../context'
import { Targets, type IntrospectionTarget } from '../../introspection'
import { type ResourceResolver } from '../../resources/resolver'
import { type Typography as TypographyFragment } from '../../resources/types'
import {
  type DeserializedRecord,
  type SerializedRecord,
} from '../../serialization'
import { type Stylesheet } from '../../stylesheet'

import { Color } from '../color'
import { ControlDefinition, serialize, type Resolvable } from '../definition'
import { DefaultControlInstance, type SendMessage } from '../instance'

import * as Schema from './schema'
import { mergeStyles, type ResolvedStyle } from './style'

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

    const value = data
    const resolvedValue = z.string()

    const definition = z.object({
      type,
    })

    return {
      type,
      definition,
      data,
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

  resolveValue(
    data: DataType | undefined,
    resolver: ResourceResolver,
    stylesheet: Stylesheet,
    _control?: InstanceType,
  ): Resolvable<ResolvedValueType | undefined> {
    const typographySub = resolver.resolveTypography(data?.id)
    // FIXME: use Effects?
    let sourceColors: Resolvable<ResolvedColorData | undefined>[] = []
    // typographySub.subscribe(() => {
    //   // FIXME
    //   const typography = this.fragmentToData(typographySub.readStableValue())
    //   sourceSwatches = resolveSwatches(typography, resolver)
    // })

    const overrideColors = resolveSwatches(data, resolver)

    const readResolved = () => {
      const typography = this.fragmentToData(typographySub.readStableValue())

      sourceColors = resolveSwatches(typography, resolver)
      const resolvedColors = [...sourceColors, ...overrideColors]
      const colors = new Map(
        resolvedColors
          .map((r) => r.readStableValue())
          .filter(isNotNil)
          .map((c) => [c.swatch.id, c]),
      )

      const source = typography?.style.map(withColor(colors)) ?? []
      const override = data?.style.map(withColor(colors)) ?? []

      return mergeStyles(source, override, stylesheet.breakpoints())
    }

    const stableValue = StableValue({
      read: () =>
        data != null
          ? stylesheet.defineStyle(
              [],
              readResolved(),
              // FIXME: implement onBoxModelChange, if at all
              (_boxModel) => {},
            )
          : undefined,
      deps: [typographySub, ...overrideColors],
    })

    return {
      data,
      readStableValue: stableValue.read,
      subscribe: stableValue.subscribe,
      triggerResolve: () =>
        Promise.all(
          [...sourceColors, ...overrideColors].map((r) => r.triggerResolve()),
        ),
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

  fragmentToData(fragment: TypographyFragment | null): DataType | undefined {
    if (fragment == null) return undefined
    return {
      id: fragment.id,
      style: fragment.style.map(({ deviceId, value }) => ({
        deviceId,
        value: mapValues(
          value,
          (prop) => prop ?? undefined,
        ) as DataType['style'][number]['value'],
      })),
    }
  }
}

function resolveSwatches(
  data: DataType | undefined,
  resolver: ResourceResolver,
): Resolvable<ResolvedColorData | undefined>[] {
  return (
    data?.style.flatMap(({ value: { color } }) =>
      color?.swatchId
        ? [
            Color().resolveSwatch(
              {
                swatchId: color.swatchId,
                alpha: color.alpha ?? 1,
              },
              resolver,
            ),
          ]
        : [],
    ) ?? []
  )
}

function withColor(colors: Map<string, ResolvedColorData>) {
  return (
    deviceRawTypographyValue: DataType['style'][number],
  ): ResolvedStyle[number] => {
    const { value, deviceId } = deviceRawTypographyValue

    if (value.color == null) {
      const { color, ...nextValue } = value
      return {
        deviceId,
        value: nextValue,
      }
    }

    const { swatchId, alpha } = value.color
    const baseColor = swatchId != null ? colors.get(swatchId) : undefined
    if (baseColor == null) {
      return {
        deviceId,
        value,
      }
    }

    return {
      deviceId,
      value: {
        ...value,
        color: {
          ...baseColor,
          alpha: alpha ?? baseColor?.alpha ?? undefined,
        },
      },
    }
  }
}

export type { ResolvedStyle as ResolvedTypographyStyle }
export class unstable_TypographyDefinition extends Definition {}

export function unstable_Typography(): unstable_TypographyDefinition {
  return new unstable_TypographyDefinition()
}
