import { z } from 'zod'
import { ControlDataTypeKey, Options, Types } from '../prop-controllers'
import { P, match } from 'ts-pattern'

const checkboxPropControllerDataV0Schema = z.boolean()

export type CheckboxPropControllerDataV0 = z.infer<
  typeof checkboxPropControllerDataV0Schema
>

export const CheckboxPropControllerDataV1Type = 'prop-controllers::checkbox::v1'

const checkboxPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(CheckboxPropControllerDataV1Type),
  value: z.boolean(),
})

export type CheckboxPropControllerDataV1 = z.infer<
  typeof checkboxPropControllerDataV1Schema
>

export const checkboxPropControllerDataSchema = z.union([
  checkboxPropControllerDataV0Schema,
  checkboxPropControllerDataV1Schema,
])

export type CheckboxPropControllerData = z.infer<
  typeof checkboxPropControllerDataSchema
>

export type CheckboxOptions = Options<{
  preset?: CheckboxPropControllerData
  label: string
  hidden?: boolean
}>

type CheckboxDescriptorV0<_T = CheckboxPropControllerDataV0> = {
  type: typeof Types.Checkbox
  options: CheckboxOptions
}

type CheckboxDescriptorV1<
  _T = CheckboxPropControllerData,
  U extends CheckboxOptions = CheckboxOptions,
> = {
  type: typeof Types.Checkbox
  version: 1
  options: U
}

export type CheckboxDescriptor<_T = CheckboxPropControllerData> =
  | CheckboxDescriptorV0
  | CheckboxDescriptorV1

export type ResolveCheckboxPropControllerValue<T extends CheckboxDescriptor> =
  T extends CheckboxDescriptor ? boolean | undefined : never

/**
 * @deprecated Imports from @makeswift/prop-controllers are deprecated. Use
 * @makeswift/runtime/controls instead.
 */
export function Checkbox(options: CheckboxOptions): CheckboxDescriptorV1 {
  return { type: Types.Checkbox, version: 1, options }
}

export function getCheckboxPropControllerDataBoolean(
  data: CheckboxPropControllerData | undefined,
): boolean | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: CheckboxPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createCheckboxPropControllerDataFromBoolean(
  value: boolean,
  definition?: CheckboxDescriptor,
): CheckboxPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      P.nullish,
      () =>
        ({
          [ControlDataTypeKey]: CheckboxPropControllerDataV1Type,
          value,
        } as const),
    )
    .otherwise(() => value)
}
