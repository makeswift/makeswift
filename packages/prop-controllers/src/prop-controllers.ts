import { z } from 'zod'

export const Types = {
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
  Link: 'Link',
  Margin: 'Margin',
  NavigationLinks: 'NavigationLinks',
  Padding: 'Padding',
  Number: 'Number',
  Shadows: 'Shadows',
  ResponsiveColor: 'ResponsiveColor',
  ResponsiveLength: 'ResponsiveLength',
  TextArea: 'TextArea',
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

export type ResolveOptions<T extends Options<unknown>> = T extends Options<
  infer U
>
  ? U
  : never

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

export type ResponsiveValueType<T> = T extends ResponsiveValue<infer U>
  ? U
  : never

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
