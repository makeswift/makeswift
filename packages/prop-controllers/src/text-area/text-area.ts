import { z } from 'zod'
import { ControlDataTypeKey, Options, Types } from '../prop-controllers'
import { match } from 'ts-pattern'

const textAreaPropControllerDataV0Schema = z.string()

export type TextAreaPropControllerDataV0 = z.infer<
  typeof textAreaPropControllerDataV0Schema
>

export const TextAreaPropControllerDataV1Type =
  'prop-controllers::text-area::v1'

const textAreaPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(TextAreaPropControllerDataV1Type),
  value: z.string(),
})

export type TextAreaPropControllerDataV1 = z.infer<
  typeof textAreaPropControllerDataV1Schema
>

export const textAreaPropControllerDataSchema = z.union([
  textAreaPropControllerDataV0Schema,
  textAreaPropControllerDataV1Schema,
])

export type TextAreaPropControllerData = z.infer<
  typeof textAreaPropControllerDataSchema
>

export type TextAreaOptions = Options<{
  preset?: TextAreaPropControllerData
  label?: string
  rows?: number
}>

type TextAreaDescriptorV0<_T = TextAreaPropControllerDataV0> = {
  type: typeof Types.TextArea
  options: TextAreaOptions
}

type TextAreaDescriptorV1<
  _T = TextAreaPropControllerData,
  U extends TextAreaOptions = TextAreaOptions,
> = {
  type: typeof Types.TextArea
  version: 1
  options: U
}

export type TextAreaDescriptor<_T = TextAreaPropControllerData> =
  | TextAreaDescriptorV0
  | TextAreaDescriptorV1

export type ResolveTextAreaPropControllerValue<T extends TextAreaDescriptor> =
  T extends TextAreaDescriptor ? string | undefined : never

/**
 * @deprecated Imports from @makeswift/prop-controllers are deprecated. Use
 * @makeswift/runtime/controls instead.
 */
export function TextArea(options: TextAreaOptions = {}): TextAreaDescriptorV1 {
  return { type: Types.TextArea, version: 1, options }
}

export function getTextAreaPropControllerDataString(
  data: TextAreaPropControllerData | undefined,
): string | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: TextAreaPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createTextAreaPropControllerDataFromString(
  value: string,
  definition: TextAreaDescriptor,
): TextAreaPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      () =>
        ({
          [ControlDataTypeKey]: TextAreaPropControllerDataV1Type,
          value,
        } as const),
    )
    .otherwise(() => value)
}
