import { z } from 'zod'

const pagePathnameSliceSchema = z.object({
  id: z.string(),
  pathname: z.string(),
  localizedPathname: z.string().optional().nullable(),
  __typename: z.literal('PagePathnameSlice'),
})

export type PagePathnameSlice = z.infer<typeof pagePathnameSliceSchema>
