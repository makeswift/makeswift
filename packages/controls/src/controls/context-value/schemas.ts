import { z } from 'zod'

export const contextValueSchema = z.object({ id: z.string() })
export const providesSchema = contextValueSchema
export const dependsOnSchema = z.record(contextValueSchema)
export const contextValuesSchema = z.record(z.unknown())
