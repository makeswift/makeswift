import { match } from 'ts-pattern'
import {
  BorderData,
  BorderSideData,
  StyleSchema,
  shouldRemoveResource,
  getReplacementResourceId,
  ContextResource,
} from '@makeswift/controls'

import {
  ControlDataTypeKey,
  CopyContext,
  ResolveOptions,
  Types,
  Schema,
} from '../prop-controllers'

import { z } from 'zod'

const responsiveBorderDataSchema = Schema.responsiveValue(StyleSchema.border)

export type ResponsiveBorderData = z.infer<typeof responsiveBorderDataSchema>

const borderPropControllerDataV0Schema = responsiveBorderDataSchema

export type BorderPropControllerDataV0 = z.infer<
  typeof borderPropControllerDataV0Schema
>

export const BorderPropControllerDataV1Type = 'prop-controllers::border::v1'

const borderPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(BorderPropControllerDataV1Type),
  value: responsiveBorderDataSchema,
})

export type BorderPropControllerDataV1 = z.infer<
  typeof borderPropControllerDataV1Schema
>

export const borderPropControllerDataSchema = z.union([
  borderPropControllerDataV0Schema,
  borderPropControllerDataV1Schema,
])

export type BorderPropControllerData = z.infer<
  typeof borderPropControllerDataSchema
>

export const BorderPropControllerFormat = {
  ClassName: 'makeswift::prop-controllers::border::format::class-name',
  ResponsiveValue:
    'makeswift::prop-controllers::border::format::responsive-value',
} as const

export type BorderPropControllerFormat =
  (typeof BorderPropControllerFormat)[keyof typeof BorderPropControllerFormat]

type BorderOptions = { format?: BorderPropControllerFormat }

type BorderDescriptorV0<
  _T = BorderPropControllerDataV0,
  U extends BorderOptions = BorderOptions,
> = {
  type: typeof Types.Border
  options: U
}

type BorderDescriptorV1<
  _T = BorderPropControllerData,
  U extends BorderOptions = BorderOptions,
> = {
  type: typeof Types.Border
  version: 1
  options: U
}

export type BorderDescriptor<
  _T = BorderPropControllerData,
  U extends BorderOptions = BorderOptions,
> = BorderDescriptorV0<_T, U> | BorderDescriptorV1<_T, U>

export type ResolveBorderPropControllerValue<T extends BorderDescriptor> =
  T extends BorderDescriptor
    ? undefined extends ResolveOptions<T['options']>['format']
      ? ResponsiveBorderData | undefined
      : ResolveOptions<
            T['options']
          >['format'] extends typeof BorderPropControllerFormat.ClassName
        ? string
        : ResolveOptions<
              T['options']
            >['format'] extends typeof BorderPropControllerFormat.ResponsiveValue
          ? ResponsiveBorderData | undefined
          : never
    : never

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function Border<T extends BorderOptions>(
  options: T & BorderOptions = {} as T,
): BorderDescriptor<BorderPropControllerData, T> {
  return { type: Types.Border, version: 1, options }
}

Border.Format = BorderPropControllerFormat

export function getBorderPropControllerDataResponsiveBorderData(
  data: BorderPropControllerData | undefined,
): ResponsiveBorderData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: BorderPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createBorderPropControllerDataFromResponsiveBorderData(
  definition: BorderDescriptor,
  responsiveBorderData: ResponsiveBorderData,
): BorderPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      () =>
        ({
          [ControlDataTypeKey]: BorderPropControllerDataV1Type,
          value: responsiveBorderData,
        }) as const,
    )
    .otherwise(() => responsiveBorderData)
}

export function getBorderPropControllerDataSwatchIds(
  data: BorderPropControllerData | undefined,
): string[] {
  return (
    getBorderPropControllerDataResponsiveBorderData(data)
      ?.flatMap((override) => override.value)
      .flatMap((borderValue) => {
        return [
          borderValue.borderTop?.color?.swatchId,
          borderValue.borderRight?.color?.swatchId,
          borderValue.borderBottom?.color?.swatchId,
          borderValue.borderLeft?.color?.swatchId,
        ].filter(
          (swatchId): swatchId is NonNullable<typeof swatchId> =>
            swatchId != null,
        )
      }) ?? []
  )
}

function copyResponsiveBorderData(
  data: ResponsiveBorderData,
  context: CopyContext,
): ResponsiveBorderData {
  return data.map((override) => ({
    ...override,
    value: copyBorderValue(override.value),
  }))

  function copyBorderValue({
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
  }: BorderData): BorderData {
    return {
      borderTop: borderTop && copyBorderSide(borderTop),
      borderRight: borderRight && copyBorderSide(borderRight),
      borderBottom: borderBottom && copyBorderSide(borderBottom),
      borderLeft: borderLeft && copyBorderSide(borderLeft),
    }
  }

  function copyBorderSide(
    borderSide: BorderSideData,
  ): BorderSideData | undefined {
    const { color } = borderSide

    if (color == null) return borderSide
    if (shouldRemoveResource(ContextResource.Swatch, color.swatchId, context)) {
      return undefined
    }

    return {
      ...borderSide,
      color: {
        ...color,
        swatchId:
          getReplacementResourceId(
            ContextResource.Swatch,
            color.swatchId,
            context,
          ) ?? color.swatchId,
      },
    }
  }
}

export function copyBorderPropControllerData(
  data: BorderPropControllerData | undefined,
  context: CopyContext,
): BorderPropControllerData | undefined {
  return match(data)
    .with(undefined, () => undefined)
    .with(
      { [ControlDataTypeKey]: BorderPropControllerDataV1Type },
      (v1) =>
        ({
          [ControlDataTypeKey]: BorderPropControllerDataV1Type,
          value: copyResponsiveBorderData(v1.value, context),
        }) as const,
    )
    .otherwise((v0) => copyResponsiveBorderData(v0, context))
}
