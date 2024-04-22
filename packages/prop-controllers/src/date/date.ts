import { z } from 'zod'
import { ControlDataTypeKey, Options, Types } from '../prop-controllers'
import { P, match } from 'ts-pattern'

const datePropControllerDataV0Schema = z.string()

export type DatePropControllerDataV0 = z.infer<
  typeof datePropControllerDataV0Schema
>

export const DatePropControllerDataV1Type = 'prop-controllers::date::v1'

const datePropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(DatePropControllerDataV1Type),
  value: z.string(),
})

export type DatePropControllerDataV1 = z.infer<
  typeof datePropControllerDataV1Schema
>

export const datePropControllerDataSchema = z.union([
  datePropControllerDataV0Schema,
  datePropControllerDataV1Schema,
])

export type DatePropControllerData = z.infer<
  typeof datePropControllerDataSchema
>

export type DateOptions = Options<{
  preset?: DatePropControllerData
}>

type DateDescriptorV0<_T = DatePropControllerDataV0> = {
  type: typeof Types.Date
  options: DateOptions
}

type DateDescriptorV1<
  _T = DatePropControllerData,
  U extends DateOptions = DateOptions,
> = {
  type: typeof Types.Date
  version: 1
  options: U
}

export type DateDescriptor<_T = DatePropControllerData> =
  | DateDescriptorV0
  | DateDescriptorV1

export type ResolveDatePropControllerValue<T extends DateDescriptor> =
  T extends DateDescriptor ? string | undefined : never

/**
 * @deprecated Imports from @makeswift/prop-controllers are deprecated. Use
 * @makeswift/runtime/controls instead.
 */
export function Date(options: DateOptions = {}): DateDescriptorV1 {
  return { type: Types.Date, version: 1, options }
}

export function getDatePropControllerDataString(
  data: DatePropControllerData | undefined,
): string | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: DatePropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createDatePropControllerDataFromString(
  value: string,
  definition?: DateDescriptor,
): DatePropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      P.nullish,
      () =>
        ({
          [ControlDataTypeKey]: DatePropControllerDataV1Type,
          value,
        } as const),
    )
    .otherwise(() => value)
}
