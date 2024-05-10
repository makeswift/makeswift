import { z } from 'zod'
import { ControlDataTypeKey, Options, Types } from '../prop-controllers'
import { match } from 'ts-pattern'

const textInputPropControllerDataV0Schema = z.string()

export type TextInputPropControllerDataV0 = z.infer<
  typeof textInputPropControllerDataV0Schema
>

export const TextInputPropControllerDataV1Type =
  'prop-controllers::text-input::v1'

const textInputPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(TextInputPropControllerDataV1Type),
  value: z.string(),
})

export type TextInputPropControllerDataV1 = z.infer<
  typeof textInputPropControllerDataV1Schema
>

export const textInputPropControllerDataSchema = z.union([
  textInputPropControllerDataV0Schema,
  textInputPropControllerDataV1Schema,
])

export type TextInputPropControllerData = z.infer<
  typeof textInputPropControllerDataSchema
>

export type TextInputOptions = Options<{
  label?: string
  placeholder?: string
  hidden?: boolean
}>

type TextInputDescriptorV0<_T = TextInputPropControllerDataV0> = {
  type: typeof Types.TextInput
  options: TextInputOptions
}

type TextInputDescriptorV1<
  _T = TextInputPropControllerData,
  U extends TextInputOptions = TextInputOptions,
> = {
  type: typeof Types.TextInput
  version: 1
  options: U
}

export type TextInputDescriptor<_T = TextInputPropControllerData> =
  | TextInputDescriptorV0
  | TextInputDescriptorV1

export type ResolveTextInputPropControllerValue<T extends TextInputDescriptor> =
  T extends TextInputDescriptor ? string | undefined : never

/**
 * @deprecated Imports from @makeswift/prop-controllers are deprecated. Use
 * @makeswift/runtime/controls instead.
 */
export function TextInput(
  options: TextInputOptions = {},
): TextInputDescriptorV1 {
  return { type: Types.TextInput, version: 1, options }
}

export function getTextInputPropControllerDataString(
  data: TextInputPropControllerData | undefined,
): string | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: TextInputPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createTextInputPropControllerDataFromString(
  value: string,
  definition: TextInputDescriptor,
): TextInputPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      () =>
        ({
          [ControlDataTypeKey]: TextInputPropControllerDataV1Type,
          value,
        } as const),
    )
    .otherwise(() => value)
}
