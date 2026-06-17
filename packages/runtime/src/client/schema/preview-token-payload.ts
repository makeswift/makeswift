import { z } from 'zod'

export const previewTokenPayload = z.object({
  payload: z.object({
    version: z.string(),
  }),
})
