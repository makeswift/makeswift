import { z } from 'zod'

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
