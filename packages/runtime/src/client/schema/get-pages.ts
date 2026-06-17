import { z } from 'zod'

export const pageData = z.object({
  id: z.string(),
  path: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  canonicalUrl: z.string().nullable(),
  socialImageUrl: z.string().nullable(),
  sitemapPriority: z.number().nullable(),
  sitemapFrequency: z
    .enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
    .nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().nullable(),
  isOnline: z.boolean().nullable(),
  excludedFromSearch: z.boolean().nullable(),
  locale: z.string(),
  localizedVariants: z.array(
    z.object({
      locale: z.string(),
      path: z.string(),
    }),
  ),
})

export const getPagesResult = z.object({
  data: z.array(pageData),
  hasMore: z.boolean(),
})

export const getPagesParams = z.object({
  limit: z.number().optional(),
  after: z.string().optional(),
  sortBy: z.enum(['title', 'path', 'description', 'createdAt', 'updatedAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  includeOffline: z.boolean().optional(),
  pathPrefix: z.string().optional(),
  locale: z.string().optional(),
})
