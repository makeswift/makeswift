import { z } from 'zod'

export const contextValue = z.object({ id: z.string() })
export const provides = contextValue
export const dependsOn = z.record(contextValue)
export const contextValues = z.record(z.unknown())
