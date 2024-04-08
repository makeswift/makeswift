import { z } from 'zod'
import {
  ControlDataTypeKey,
  ResolveOptions,
  Types,
  createResponsiveValueSchema,
} from '../prop-controllers'
import { lengthDataSchema } from '../data'
import { match } from 'ts-pattern'

const borderRadiusDataSchema = z.object({
  borderTopLeftRadius: lengthDataSchema.nullable().optional(),
  borderTopRightRadius: lengthDataSchema.nullable().optional(),
  borderBottomLeftRadius: lengthDataSchema.nullable().optional(),
  borderBottomRightRadius: lengthDataSchema.nullable().optional(),
})

const responsiveBorderRadiusDataSchema = createResponsiveValueSchema(
  borderRadiusDataSchema,
)

export type ResponsiveBorderRadiusData = z.infer<
  typeof responsiveBorderRadiusDataSchema
>

const borderRadiusPropControllerDataV0Schema = responsiveBorderRadiusDataSchema

type BorderRadiusPropControllerDataV0 = z.infer<
  typeof borderRadiusPropControllerDataV0Schema
>

const BorderRadiusPropControllerDataV1Type =
  'prop-controllers::border-radius::v1'

const borderRadiusPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(BorderRadiusPropControllerDataV1Type),
  value: responsiveBorderRadiusDataSchema,
})

export const borderRadiusPropControllerDataSchema = z.union([
  borderRadiusPropControllerDataV0Schema,
  borderRadiusPropControllerDataV1Schema,
])

export type BorderRadiusPropControllerData = z.infer<
  typeof borderRadiusPropControllerDataSchema
>

export const BorderRadiusPropControllerFormat = {
  ClassName: 'makeswift::prop-controllers::border-radius::format::class-name',
  ResponsiveValue:
    'makeswift::prop-controllers::border-radius::format::responsive-value',
} as const

export type BorderRadiusPropControllerFormat =
  typeof BorderRadiusPropControllerFormat[keyof typeof BorderRadiusPropControllerFormat]

type BorderRadiusOptions = { format?: BorderRadiusPropControllerFormat }

type BorderRadiusDescriptorV0<
  _T = BorderRadiusPropControllerDataV0,
  U extends BorderRadiusOptions = BorderRadiusOptions,
> = {
  type: typeof Types.BorderRadius
  options: U
}

type BorderRadiusDescriptorV1<
  _T = BorderRadiusPropControllerData,
  U extends BorderRadiusOptions = BorderRadiusOptions,
> = {
  type: typeof Types.BorderRadius
  version: 1
  options: U
}

export type BorderRadiusDescriptor<
  _T = BorderRadiusPropControllerData,
  U extends BorderRadiusOptions = BorderRadiusOptions,
> = BorderRadiusDescriptorV0<_T, U> | BorderRadiusDescriptorV1<_T, U>

export type ResolveBorderRadiusPropControllerValue<
  T extends BorderRadiusDescriptor,
> = T extends BorderRadiusDescriptor
  ? undefined extends ResolveOptions<T['options']>['format']
    ? ResponsiveBorderRadiusData | undefined
    : ResolveOptions<
        T['options']
      >['format'] extends typeof BorderRadiusPropControllerFormat.ClassName
    ? string
    : ResolveOptions<
        T['options']
      >['format'] extends typeof BorderRadiusPropControllerFormat.ResponsiveValue
    ? ResponsiveBorderRadiusData | undefined
    : never
  : never

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function BorderRadius<T extends BorderRadiusOptions>(
  options: T & BorderRadiusOptions = {} as T,
): BorderRadiusDescriptor<BorderRadiusPropControllerData, T> {
  return { type: Types.BorderRadius, version: 1, options }
}

BorderRadius.Format = BorderRadiusPropControllerFormat

export function getBorderRadiusPropControllerDataResponsiveBorderRadiusData(
  data: BorderRadiusPropControllerData | undefined,
): ResponsiveBorderRadiusData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: BorderRadiusPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createBorderRadiusPropControllerDataFromResponsiveBorderRadiusData(
  definition: BorderRadiusDescriptor,
  responsiveBorderRadiusData: ResponsiveBorderRadiusData,
): BorderRadiusPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      () =>
        ({
          [ControlDataTypeKey]: BorderRadiusPropControllerDataV1Type,
          value: responsiveBorderRadiusData,
        } as const),
    )
    .otherwise(() => responsiveBorderRadiusData)
}
