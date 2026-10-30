import { match } from 'ts-pattern'
import { z } from 'zod'

import { isNotNil, mapValues } from '../../lib/functional'
import { StableValue } from '../../lib/stable-value'
import { safeParse, type ParseResult } from '../../lib/zod'

import { ControlDataTypeKey } from '../../common'
import {
  ContextResource,
  replaceResourceIfNeeded,
  shouldRemoveResource,
  type CopyContext,
} from '../../context'
import { Targets, type IntrospectionTarget } from '../../introspection'
import { resolveInlineColorData } from '../../resources'
import { type ResourceResolver } from '../../resources/resolver'
import {
  type ResolvedColorData,
  type Typography as TypographyFragment,
} from '../../resources/types'
import { type DeserializedRecord } from '../../serialization'
import { type Stylesheet } from '../../stylesheet'

import { Color } from '../color'
import { ControlDefinition, type Resolvable } from '../definition'
import { DefaultControlInstance, type ControlInstanceArgs } from '../instance'
import { ControlDefinitionVisitor } from '../visitor'

import * as Schema from './schema'
import { mergeStyles, type ResolvedStyle } from './style'

type Schema = typeof Definition.schema
type DataType = z.infer<Schema['data']>
type ValueType = z.infer<Schema['value']>
type ResolvedValueType = z.infer<Schema['resolvedValue']>
type InstanceType = DefaultControlInstance

type ColorData = z.infer<typeof Schema.colorData>
type ColorDataV2 = z.infer<typeof Schema.colorDataV2>

type Typography<Color> = z.infer<
  ReturnType<typeof Schema.typography<z.ZodType<Color | null>>>
>
type ResponsiveStyle<Color> = Typography<Color>['style']
type DataTypeV0 = Typography<ColorData>

class Definition extends ControlDefinition<
  typeof Definition.type,
  unknown,
  DataType,
  ValueType,
  ResolvedValueType,
  InstanceType
> {
  private static readonly v1DataType = 'typography::v1' as const
  private static readonly dataSignature = {
    v1: { [ControlDataTypeKey]: this.v1DataType },
  } as const

  static readonly type = 'makeswift::controls::typography' as const

  static get schema() {
    const type = z.literal(Definition.type)
    const version = z.literal(1).optional()

    const value = Schema.typography(Schema.colorDataV2.nullable())
    const data = z.union([
      // first, as zod would otherwise parse it as v0 data and drop its data type
      value.extend({ [ControlDataTypeKey]: z.literal(this.v1DataType) }),
      Schema.typography(Schema.colorData.nullable()),
    ])
    const resolvedValue = z.string()

    const definition = z.object({
      type,
      version,
    })

    return {
      type,
      version,
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

    const { version } = Definition.schema.definition.parse(data)
    return new (class Typography extends Definition {})(version)
  }

  constructor(readonly version: z.infer<typeof Definition.schema.version>) {
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
    return this.toValue(this.schema.data.optional().parse(data))
  }

  /**
   * Unlike `fromData`, doesn't parse the data, as typography stored in rich
   * text nodes isn't validated.
   */
  toValue(data: DataType | undefined): ValueType | undefined {
    return match(data)
      .with(undefined, () => undefined)
      .with(
        Definition.dataSignature.v1,
        ({ [ControlDataTypeKey]: _, ...value }) => value,
      )
      .otherwise(({ style, ...v0 }) => ({
        ...v0,
        style: mapStyleColors(style, toColorDataV2),
      }))
  }

  toData(value: ValueType): DataType {
    return match(this.version)
      .with(1, () => ({ ...Definition.dataSignature.v1, ...value }))
      .with(undefined, () => ({
        ...value,
        style: mapStyleColors(value.style, toColorDataV1),
      }))
      .exhaustive()
  }

  copyData(
    data: DataType | undefined,
    context: CopyContext,
  ): DataType | undefined {
    if (data == null) return data

    function replaceOverrideSwatchId(swatchId: string | null): string | null {
      if (
        swatchId == null ||
        shouldRemoveResource(ContextResource.Swatch, swatchId, context)
      ) {
        return null
      }
      return replaceResourceIfNeeded(ContextResource.Swatch, swatchId, context)
    }

    function replaceTypographyId(id: string | null): string | undefined {
      if (
        id == null ||
        shouldRemoveResource(ContextResource.Typography, id, context)
      ) {
        return undefined
      }
      return replaceResourceIfNeeded(ContextResource.Typography, id, context)
    }

    function copySwatchColor<
      T extends { swatchId: string | null; alpha: number | null },
    >(color: T): T {
      // Can't use Color().copyData() here as typography's color definition
      // accepts null for swatchId and alpha, while Color Data does not.
      return {
        ...color,
        alpha: color.alpha ?? null,
        // We remove/replace resource references at the finest granularity
        // permitted by the data. In the case of typography, the data does
        // permit for a nullish swatch ID, so we keep the other information
        // (alpha) and only clear the swatch ID. For other cases (ex: Color()
        // data(), we have to clear the entire data since swatch IDs can't be
        // null.
        swatchId: replaceOverrideSwatchId(color.swatchId),
      }
    }

    function copyTypography<Color>(
      typography: Typography<Color>,
      copyColor: (color: Color) => Color,
    ): Typography<Color> {
      return {
        id: replaceTypographyId(typography.id ?? null),
        style: mapStyleColors(typography.style, copyColor),
      }
    }

    return match(data)
      .with(Definition.dataSignature.v1, (v1) => ({
        ...v1,
        ...copyTypography(v1, (color: ColorDataV2) =>
          color.type === 'inline' ? color : copySwatchColor(color),
        ),
      }))
      .otherwise((v0) => ({ ...v0, ...copyTypography(v0, copySwatchColor) }))
  }

  resolveValueFromData(): undefined {
    return undefined
  }

  resolveValue(
    data: DataType | undefined,
    resolver: ResourceResolver,
    stylesheet: Stylesheet,
    _control?: InstanceType,
  ): Resolvable<ResolvedValueType | undefined> {
    const value = this.toValue(data)

    const typographySub = resolver.resolveTypography(value?.id)
    const typographyValue = StableValue({
      name: `${Definition.type}:data`,
      read: () => this.toValue(this.fragmentToData(typographySub.readStable())),
      deps: [typographySub],
    })

    const overrideColors = resolveSwatches(value, resolver)
    const resolveSourceColors = (function () {
      let unsubscribes: (() => void)[] = []
      return () => {
        const sourceColors = resolveSwatches(
          typographyValue.readStable(),
          resolver,
        )
        unsubscribes.forEach((u) => u())
        unsubscribes = sourceColors.map((v) =>
          v.subscribe(() => stableValue.reset()),
        )

        return sourceColors
      }
    })()

    const readResolved = () => {
      const sourceColors = resolveSourceColors()
      const resolvedColors = [...sourceColors, ...overrideColors]
      const colors = new Map(
        resolvedColors
          .map((r) => r.readStable())
          .filter(isNotNil)
          .map((c) => [c.swatch.id, c]),
      )

      const typography = typographyValue.readStable()
      const source = typography?.style.map(withColor(colors)) ?? []
      const override = value?.style.map(withColor(colors)) ?? []

      return mergeStyles(source, override, stylesheet.breakpoints())
    }

    const stableValue = StableValue({
      name: Definition.type,
      read: () => stylesheet.defineStyle(readResolved()),
      deps: [typographyValue, ...overrideColors],
    })

    return {
      ...stableValue,
      triggerResolve: async () => {
        if (typographySub.readStable() == null) {
          typographySub.fetch()
        }

        await Promise.all(
          [
            ...resolveSwatches(typographyValue.readStable(), resolver),
            ...overrideColors,
          ].map((r) => r.triggerResolve()),
        )
      },
    }
  }

  createInstance(args: ControlInstanceArgs) {
    return new DefaultControlInstance(args)
  }

  accept<R>(visitor: ControlDefinitionVisitor<R>, ...args: unknown[]): R {
    return visitor.visitTypography(this, ...args)
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

  fragmentToData(fragment: TypographyFragment | null): DataTypeV0 | undefined {
    if (fragment == null) return undefined
    return {
      id: fragment.id,
      style: fragment.style.map(({ deviceId, value }) => ({
        deviceId,
        value: mapValues(
          value,
          (prop) => prop ?? undefined,
        ) as DataTypeV0['style'][number]['value'],
      })),
    }
  }
}

function resolveSwatches(
  value: ValueType | undefined,
  resolver: ResourceResolver,
): Resolvable<ResolvedColorData | undefined>[] {
  return (
    value?.style.flatMap(({ value: { color } }) =>
      color?.type === 'swatch' && color.swatchId
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
    deviceRawTypographyValue: ValueType['style'][number],
  ): ResolvedStyle[number] => {
    const { value, deviceId } = deviceRawTypographyValue

    if (value.color == null) {
      const { color, ...nextValue } = value
      return {
        deviceId,
        value: nextValue,
      }
    }

    if (value.color.type === 'inline') {
      return {
        deviceId,
        value: { ...value, color: resolveInlineColorData(value.color) },
      }
    }

    const { swatchId, alpha } = value.color
    const baseColor = swatchId != null ? colors.get(swatchId) : undefined

    return {
      deviceId,
      value: {
        ...value,
        color:
          baseColor != null
            ? {
                ...baseColor,
                alpha: alpha ?? baseColor?.alpha ?? undefined,
              }
            : undefined,
      },
    }
  }
}

function mapStyleColors<From, To>(
  style: ResponsiveStyle<From>,
  callback: (color: From) => To,
): ResponsiveStyle<To>
// zod's types can't be narrowed while `Color` is a type parameter
function mapStyleColors(
  style: ResponsiveStyle<unknown>,
  callback: (color: unknown) => unknown,
): ResponsiveStyle<unknown> {
  return style.map(({ value: { color, ...value }, ...override }) => ({
    ...override,
    value:
      color === undefined
        ? value
        : { ...value, color: color == null ? color : callback(color) },
  }))
}

function toColorDataV2({ swatchId, alpha }: ColorData): ColorDataV2 {
  return { type: 'swatch', swatchId, alpha }
}

/**
 * Throws for inline colors, which data written by earlier versions can't
 * represent.
 */
function toColorDataV1(color: ColorDataV2): ColorData {
  if (color.type === 'inline') {
    throw new Error(
      `Inline colors can't be written as swatch color data: ${JSON.stringify(color)}`,
    )
  }

  return { swatchId: color.swatchId, alpha: color.alpha }
}

export type { ResolvedStyle as ResolvedTypographyStyle }
export class unstable_TypographyDefinition extends Definition {}

export function unstable_Typography(): unstable_TypographyDefinition {
  return new unstable_TypographyDefinition(1)
}
