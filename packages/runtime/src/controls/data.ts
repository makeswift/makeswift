import { z } from 'zod'

export type Data = undefined | null | boolean | number | string | Data[] | { [key: string]: Data }

export const dataSchema: z.ZodType<Data> = z.union([
  z.undefined(),
  z.null(),
  z.boolean(),
  z.number(),
  z.string(),
  z.array(z.lazy(() => dataSchema)),
  z.record(z.lazy(() => dataSchema)),
])

export const elementDataSchema = z.object({
  type: z.string(),
  key: z.string(),
  props: z.record(dataSchema),
})

export type ElementData = z.infer<typeof elementDataSchema>

export const elementReferenceSchema = z.object({
  type: z.literal('reference'),
  key: z.string(),
  value: z.string(),
})

export type ElementReference = z.infer<typeof elementReferenceSchema>

export const elementSchema = z.union([elementDataSchema, elementReferenceSchema])

export const deletableElementSchema = z.union([
  elementDataSchema.extend({
    deleted: z.boolean().optional(),
  }),
  elementReferenceSchema.extend({
    deleted: z.boolean().optional(),
  }),
])

export type Element = z.infer<typeof elementSchema>
