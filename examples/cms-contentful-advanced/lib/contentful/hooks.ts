import { Document } from '@contentful/rich-text-types'

import { Asset, Author, BlogPost, BlogPostBodyLinks } from '@/generated/contentful'
import { useContentfulData } from '@/lib/contentful/provider'

export type ResolvedField = { data: unknown } | { error: string }

export const isRichText = (field: any): field is { json: Document; links: BlogPostBodyLinks } =>
  field?.json?.nodeType === 'document'

export const isAsset = (field: any): field is Asset => {
  return field?.__typename === 'Asset'
}

export function resolvePath<T extends string>(
  path: string | Array<T>,
  obj?: { [key: string]: any } | null,
  separator: string = '.'
): any {
  const properties = Array.isArray(path) ? path : path.split(separator)

  return properties.reduce((prev, curr) => prev?.[curr], obj ?? {})
}

type ContentfulEntry = ({ __typename: 'BlogPost' } & BlogPost) | ({ __typename: 'Author' } & Author)
type EntryType = 'BlogPost' | 'Author'

function isEntryType(data: unknown, type: EntryType): data is ContentfulEntry {
  if (typeof data !== 'object' || data === null) return false

  return '__typename' in data && data.__typename === type
}

export function useEntryField({
  fieldPath,
  type,
}: {
  fieldPath?: string
  type: EntryType
}): ResolvedField {
  const { data, error } = useContentfulData()

  if (error) return { error: 'No entry found.' }

  if (!fieldPath) return { error: 'Field path is not set.' }

  if (!isEntryType(data, type)) {
    return { error: `Invalid ${type} data structure.` }
  }

  const field = resolvePath(fieldPath, data)

  if (!field) return { error: `Cannot find field at ${fieldPath}. Check the graphql query.` }

  return { data: field }
}
