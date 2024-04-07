import { match } from 'ts-pattern'
import { ColorData } from './data'
import {
  ControlDataTypeKey,
  CopyContext,
  ResolveOptions,
  ResponsiveValue,
  Types,
} from './prop-controllers'

type ShadowData = {
  color?: ColorData | null
  blurRadius?: number
  spreadRadius?: number
  offsetX?: number
  offsetY?: number
  inset?: boolean
}

type ShadowsData = { id: string; payload: ShadowData }[]

type ResponsiveShadowsData = ResponsiveValue<ShadowsData>

type ShadowsPropControllerDataV0 = ResponsiveShadowsData

const ShadowsPropControllerDataV1Type = 'prop-controllers::shadows::v1'

type ShadowsPropControllerDataV1 = {
  [ControlDataTypeKey]: typeof ShadowsPropControllerDataV1Type
  value: ResponsiveShadowsData
}

export type ShadowsPropControllerData =
  | ShadowsPropControllerDataV0
  | ShadowsPropControllerDataV1

export const ShadowsPropControllerFormat = {
  ClassName: 'makeswift::prop-controllers::shadows::format::class-name',
  ResponsiveValue:
    'makeswift::prop-controllers::shadows::format::responsive-value',
} as const

export type ShadowsPropControllerFormat =
  typeof ShadowsPropControllerFormat[keyof typeof ShadowsPropControllerFormat]

type ShadowsOptions = { format?: ShadowsPropControllerFormat }

type ShadowsDescriptorV0<
  _T = ShadowsPropControllerDataV0,
  U extends ShadowsOptions = ShadowsOptions,
> = {
  type: typeof Types.Shadows
  options: U
}

type ShadowsDescriptorV1<
  _T = ShadowsPropControllerData,
  U extends ShadowsOptions = ShadowsOptions,
> = {
  type: typeof Types.Shadows
  version: 1
  options: U
}

export type ShadowsDescriptor<
  _T = ShadowsPropControllerData,
  U extends ShadowsOptions = ShadowsOptions,
> = ShadowsDescriptorV0<_T, U> | ShadowsDescriptorV1<_T, U>

export type ResolveShadowsPropControllerValue<T extends ShadowsDescriptor> =
  T extends ShadowsDescriptor
    ? undefined extends ResolveOptions<T['options']>['format']
      ? ResponsiveShadowsData | undefined
      : ResolveOptions<
          T['options']
        >['format'] extends typeof ShadowsPropControllerFormat.ClassName
      ? string
      : ResolveOptions<
          T['options']
        >['format'] extends typeof ShadowsPropControllerFormat.ResponsiveValue
      ? ResponsiveShadowsData | undefined
      : never
    : never

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function Shadows<T extends ShadowsOptions>(
  options: T & ShadowsOptions = {} as T,
): ShadowsDescriptor<ShadowsPropControllerData, T> {
  return { type: Types.Shadows, version: 1, options }
}

Shadows.Format = ShadowsPropControllerFormat

export function getShadowsPropControllerDataResponsiveShadowsData(
  data: ShadowsPropControllerData | null | undefined,
): ResponsiveShadowsData | null | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: ShadowsPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function getShadowsPropControllerDataSwatchIds(
  data: ShadowsPropControllerData | null | undefined,
): string[] {
  return (
    getShadowsPropControllerDataResponsiveShadowsData(data)
      ?.flatMap((override) => override.value)
      .map((item) => item.payload.color?.swatchId)
      .filter(
        (swatchId): swatchId is NonNullable<typeof swatchId> =>
          swatchId != null,
      ) ?? []
  )
}

function copyResponsiveShadowsData(
  data: ResponsiveShadowsData,
  context: CopyContext,
): ResponsiveShadowsData {
  return data.map((override) => ({
    ...override,
    value: override.value.map((item) => {
      const { color } = item.payload

      if (color == null) return item

      return {
        ...item,
        payload: {
          ...item.payload,
          color: {
            ...color,
            swatchId:
              context.replacementContext.swatchIds.get(color.swatchId) ??
              color.swatchId,
          },
        },
      }
    }),
  }))
}

export function copyShadowsPropControllerData(
  data: ShadowsPropControllerData | undefined,
  context: CopyContext,
): ShadowsPropControllerData | undefined {
  return match(data)
    .with(undefined, () => undefined)
    .with(
      { [ControlDataTypeKey]: ShadowsPropControllerDataV1Type },
      (v1) =>
        ({
          [ControlDataTypeKey]: ShadowsPropControllerDataV1Type,
          value: copyResponsiveShadowsData(v1.value, context),
        } as const),
    )
    .otherwise((v0) => copyResponsiveShadowsData(v0, context))
}
