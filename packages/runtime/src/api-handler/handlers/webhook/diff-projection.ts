import { z } from 'zod'

const changeTypeSchema = z.enum(['created', 'updated', 'deleted'])

// `locale` is null for the default locale. We'd prefer explicit locale strings
// (e.g. "en-US"), but both server and runtime treat the default locale as null
// today — changing that requires a broader localization rework.
const componentChangeSchema = z.object({
  id: z.string(),
  locale: z.string().nullable(),
  changeType: changeTypeSchema,
})

const pageChangeSchema = z.object({
  pageId: z.string().uuid(),
  locale: z.string().nullable(),
  changeType: changeTypeSchema,
  pathname: z.string(),
  previousPathname: z.string().optional(),
})

const globalElementChangeSchema = z.object({
  id: z.string().uuid(),
  locale: z.string().nullable(),
  changeType: changeTypeSchema,
})

const swatchChangeSchema = z.object({
  id: z.string().uuid(),
  changeType: changeTypeSchema,
})

const typographyChangeSchema = z.object({
  id: z.string().uuid(),
  changeType: changeTypeSchema,
})

export const diffProjectionSchema = z
  .object({
    components: z.array(componentChangeSchema),
    pages: z.array(pageChangeSchema),
    globalElements: z.array(globalElementChangeSchema),
    swatches: z.array(swatchChangeSchema),
    typographies: z.array(typographyChangeSchema),
  })
  // passthrough() preserves unknown resource types the server may add in the
  // future (e.g. `fonts`), so onPublish consumers can access them without a
  // runtime upgrade.
  .passthrough()
