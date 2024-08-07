import { z } from 'zod'
import { AssociatedType } from './utils/associated-types'

export const Types = {
  Backgrounds: 'Backgrounds',
  Border: 'Border',
  BorderRadius: 'BorderRadius',
  Checkbox: 'Checkbox',
  Date: 'Date',
  ElementID: 'ElementID',
  Font: 'Font',
  GapX: 'GapX',
  GapY: 'GapY',
  Grid: 'Grid',
  Image: 'Image',
  Images: 'Images',
  Link: 'Link',
  Margin: 'Margin',
  NavigationLinks: 'NavigationLinks',
  Padding: 'Padding',
  Number: 'Number',
  Shadows: 'Shadows',
  ResponsiveColor: 'ResponsiveColor',
  ResponsiveIconRadioGroup: 'ResponsiveIconRadioGroup',
  ResponsiveLength: 'ResponsiveLength',
  ResponsiveNumber: 'ResponsiveNumber',
  ResponsiveOpacity: 'ResponsiveOpacity',
  ResponsiveSelect: 'ResponsiveSelect',
  SocialLinks: 'SocialLinks',
  TextArea: 'TextArea',
  TextInput: 'TextInput',
  Table: 'Table',
  TableFormFields: 'TableFormFields',
  TextStyle: 'TextStyle',
  Width: 'Width',
  Video: 'Video',
} as const

export const ControlDataTypeKey = '@@makeswift/type'

export type Options<T> =
  | T
  | ((props: Record<string, unknown>, deviceMode: Device) => T)

export type ResolveOptions<T extends Options<unknown>> =
  T extends Options<infer U> ? U : never

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

export type Color = { swatchId: string; alpha: number }

export type Data =
  | undefined
  | null
  | boolean
  | number
  | string
  | Data[]
  | { [key: string]: Data }

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

export type PropType<T> = AssociatedType<T, 'Type'>
export type PropData<T> = AssociatedType<T, 'PropData'>
export type Value<T> = AssociatedType<T, 'Value'>
export type Descriptor<T> = AssociatedType<T, 'Descriptor'>
export type Discriminator<T> = AssociatedType<T, 'Discriminator'>
export type OptionsType<T> = AssociatedType<Descriptor<T>, 'Options'>
export type RawOptionsType<T> = ResolveOptions<OptionsType<T>>

export type PrimitiveValue<T> =
  Value<T> extends ResponsiveValue<infer U> ? U : Value<T>
