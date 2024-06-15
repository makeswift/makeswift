import { z } from 'zod'
import { AssociatedType } from '../utils/associated-types'

export type Data =
  | undefined
  | null
  | boolean
  | number
  | string
  | Data[]
  | { [key: string]: Data }

export const colorDataSchema = z.object({
  swatchId: z.string(),
  alpha: z.number(),
})

export type ColorData = z.infer<typeof colorDataSchema>

export const ControlDataTypeKey = '@@makeswift/type'

const deviceSchema = z.string()

export type Device = z.infer<typeof deviceSchema>

function createDeviceOverrideSchema<T extends z.ZodTypeAny>(
  schema: T,
): z.ZodObject<{ deviceId: typeof deviceSchema; value: T }> {
  return z.object({
    deviceId: deviceSchema,
    value: schema,
  })
}

export type DeviceOverride<T> = { deviceId: Device; value: T }

export function createResponsiveValueSchema<T extends z.ZodTypeAny>(
  schema: T,
): z.ZodArray<ReturnType<typeof createDeviceOverrideSchema<T>>> {
  return z.array(createDeviceOverrideSchema(schema))
}

export type ResponsiveValue<T> = DeviceOverride<T>[]

export type ResponsiveValueType<T> =
  T extends ResponsiveValue<infer U> ? U : never

export const dataSchema: z.ZodType<Data> = z.any()

export const elementDataSchema = z.object({
  type: z.string(),
  key: z.string(),
  props: z.record(dataSchema),
})

export type ElementData = z.infer<typeof elementDataSchema>

const elementReferenceSchema = z.object({
  type: z.literal('reference'),
  key: z.string(),
  value: z.string(),
})

export type ElementReference = z.infer<typeof elementReferenceSchema>

export const elementSchema = z.union([
  elementDataSchema,
  elementReferenceSchema,
])

export type Element = z.infer<typeof elementSchema>

export type TranslationDto = Record<string, Data>
export type MergeTranslatableDataContext = {
  translatedData: TranslationDto
  mergeTranslatedData: (node: Element) => Element
}

export type ReplacementContext = {
  elementHtmlIds: Set<string>
  elementKeys: Map<string, string>
  swatchIds: Map<string, string>
  fileIds: Map<string, string>
  typographyIds: Map<string, string>
  tableIds: Map<string, string>
  tableColumnIds: Map<string, string>
  pageIds: Map<string, string>
  globalElementIds: Map<string, string>
  globalElementData: Map<string, ElementData>
}

export type CopyContext = {
  replacementContext: ReplacementContext
  copyElement: (node: Element) => Element
}

// export type PropType<T> = AssociatedType<T, 'Type'>
export type ControlDefinitionType<T> = AssociatedType<T, 'ControlDefinition'>
export type ControlDataType<T> = AssociatedType<T, 'ControlData'>
export type ValueType<T> = AssociatedType<T, 'ValueType'>
export type ResolvedValueType<T> = AssociatedType<T, 'ResolvedValueType'>
// export type Descriptor<T> = AssociatedType<T, 'Descriptor'>
// export type Discriminator<T> = AssociatedType<T, 'Discriminator'>
// export type OptionsType<T> = AssociatedType<Descriptor<T>, 'Options'>
// export type RawOptionsType<T> = ResolveOptions<OptionsType<T>>
