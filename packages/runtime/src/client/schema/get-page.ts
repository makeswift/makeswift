import { z } from 'zod'

export const getPageResult = z.object({
  pathname: z.string(),
  locale: z.string(),
  alternate: z.array(
    z.object({
      pathname: z.string(),
      locale: z.string(),
    }),
  ),
})
