import { z } from 'zod'
import {
  ControlDataTypeKey,
  CopyContext,
  Options,
  Types,
} from '../prop-controllers'
import { P, match } from 'ts-pattern'

const elementIDSchema = z.string()

type ElementID = z.infer<typeof elementIDSchema>

const elementIDPropControllerDataV0Schema = elementIDSchema

export type ElementIDPropControllerDataV0 = z.infer<
  typeof elementIDPropControllerDataV0Schema
>

export const ElementIDPropControllerDataV1Type =
  'prop-controllers::element-id::v1'

const elementIDPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(ElementIDPropControllerDataV1Type),
  value: elementIDSchema,
})

export type ElementIDPropControllerDataV1 = z.infer<
  typeof elementIDPropControllerDataV1Schema
>

export const elementIDPropControllerDataSchema = z.union([
  elementIDPropControllerDataV0Schema,
  elementIDPropControllerDataV1Schema,
])

export type ElementIDPropControllerData = z.infer<
  typeof elementIDPropControllerDataSchema
>

export type ElementIDOptions = Options<Record<string, never>>

type ElementIDDescriptorV0<_T = ElementIDPropControllerDataV0> = {
  type: typeof Types.ElementID
  options: ElementIDOptions
}

type ElementIDDescriptorV1<
  _T = ElementIDPropControllerData,
  U extends ElementIDOptions = ElementIDOptions,
> = {
  type: typeof Types.ElementID
  version: 1
  options: U
}

export type ElementIDDescriptor<_T = ElementIDPropControllerData> =
  | ElementIDDescriptorV0
  | ElementIDDescriptorV1

export type ResolveElementIDPropControllerValue<T extends ElementIDDescriptor> =
  T extends ElementIDDescriptor ? ElementID | undefined : never

/**
 * @deprecated Imports from @makeswift/prop-controllers are deprecated. Use
 * @makeswift/runtime/controls instead.
 */
export function ElementID(
  options: ElementIDOptions = {},
): ElementIDDescriptorV1 {
  return { type: Types.ElementID, version: 1, options }
}

export function getElementIDPropControllerDataElementID(
  data: ElementIDPropControllerData | undefined,
): ElementID | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: ElementIDPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createElementIDPropControllerDataFromElementID(
  value: ElementID,
  definition: ElementIDDescriptor,
): ElementIDPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      P.nullish,
      () =>
        ({
          [ControlDataTypeKey]: ElementIDPropControllerDataV1Type,
          value,
        } as const),
    )
    .otherwise(() => value)
}

function copyElementID(
  data: ElementID | undefined,
  context: CopyContext,
): ElementID | undefined {
  if (data == null) return data

  if (context.replacementContext.elementHtmlIds.has(data)) return undefined

  context.replacementContext.elementHtmlIds.add(data)

  return data
}

export function copyElementIDPropControllerData(
  data: ElementIDPropControllerData | undefined,
  context: CopyContext,
): ElementIDPropControllerData | undefined {
  return match(data)
    .with(undefined, () => undefined)
    .with({ [ControlDataTypeKey]: ElementIDPropControllerDataV1Type }, (v1) => {
      const value = copyElementID(v1.value, context)

      if (value == null) return undefined

      return {
        [ControlDataTypeKey]: ElementIDPropControllerDataV1Type,
        value,
      } as const
    })
    .otherwise((v0) => copyElementID(v0, context))
}
