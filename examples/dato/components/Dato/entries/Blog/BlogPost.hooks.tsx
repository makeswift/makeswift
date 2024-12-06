'use client'

import useSWR from 'swr'

import { BlogPostDocument, BlogPostInfoFragment } from '@/generated/dato'
import { client } from '@/lib/dato/client'
import { ResolvedField, resolvePath } from '@/lib/dato/utils'
import { useSlug } from '@/lib/utils'

export function useEntry(): { error: string } | { data: BlogPostInfoFragment } {
  const slug = useSlug()

  const { data } = useSWR(
    `blog/${slug}`,
    async () =>
      await client.request(BlogPostDocument, {
        slug,
      }),
    {
      keepPreviousData: true,
    }
  )

  if (!slug) return { error: 'Cannot find slug.' }

  if (!data) return { error: `Cannot find entry at ${slug}.` }

  if (!data.blog) {
    return { error: `Returned falsy value at ${slug}.` }
  }

  return { data: data.blog }
}

export function useEntryField({ fieldPath }: { fieldPath?: string }): ResolvedField {
  const entry = useEntry()

  if ('error' in entry) return entry

  if (!fieldPath) return { error: 'Field path is not set.' }

  const field = resolvePath(fieldPath, entry.data)

  if (!field && field !== null)
    return { error: `Cannot find field at ${fieldPath}. Check the graphql query.` }

  return { data: field }
}
