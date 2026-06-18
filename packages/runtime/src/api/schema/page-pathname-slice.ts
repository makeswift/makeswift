import { z } from 'zod'

export const pagePathnameSlices = z.array(
  z
    .object({
      id: z.string(),
      basePageId: z.string(),
      pathname: z.string(),
      localizedPathname: z.string().optional(),
      __typename: z.literal('PagePathnameSlice'),
    })
    .nullable(),
)
