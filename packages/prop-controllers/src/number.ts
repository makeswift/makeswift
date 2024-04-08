import { z } from 'zod'
import { ControlDataTypeKey, Options, Types } from './prop-controllers'
import { P, match } from 'ts-pattern'

const numberPropControllerDataV0Schema = z.number()

type NumberPropControllerDataV0 = z.infer<
  typeof numberPropControllerDataV0Schema
>

const NumberPropControllerDataV1Type = 'prop-controllers::number::v1'

const numberPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(NumberPropControllerDataV1Type),
  value: z.number(),
})

type NumberPropControllerDataV1 = z.infer<
  typeof numberPropControllerDataV1Schema
>

export const numberPropControllerDataSchema = z.union([
  numberPropControllerDataV0Schema,
  numberPropControllerDataV1Schema,
])

export type NumberPropControllerData = z.infer<
  typeof numberPropControllerDataSchema
>

export type NumberOptions = Options<{
  preset?: NumberPropControllerData
  label?: string
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  suffix?: string
  hidden?: boolean
}>

type NumberDescriptorV0<_T = NumberPropControllerDataV0> = {
  type: typeof Types.Number
  options: NumberOptions
}

type NumberDescriptorV1<_T = NumberPropControllerDataV1> = {
  type: typeof Types.Number
  version: 1
  options: NumberOptions
}

export type NumberDescriptor<_T = NumberPropControllerData> =
  | NumberDescriptorV0
  | NumberDescriptorV1

export type ResolveNumberPropControllerValue<T extends NumberDescriptor> =
  T extends NumberDescriptor ? number | undefined : never

/**
 * @deprecated Imports from `@makeswift/runtime/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function Number(options: NumberOptions = {}): NumberDescriptorV1 {
  return { type: Types.Number, version: 1, options }
}

export function getNumberPropControllerDataNumber(
  data: NumberPropControllerData,
): number {
  return match(data)
    .with(
      { [ControlDataTypeKey]: NumberPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createNumberPropControllerDataFromNumber(
  value: number,
  definition?: NumberDescriptor,
): NumberPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      P.nullish,
      () =>
        ({
          [ControlDataTypeKey]: NumberPropControllerDataV1Type,
          value,
        } as const),
    )
    .otherwise(() => value)
}
