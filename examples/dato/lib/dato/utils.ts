import { ResponsiveImageType, StructuredTextGraphQlResponse } from 'react-datocms'

import { SingleImageFragment, TypeFragment, TypesDocument } from '@/generated/dato'

import { client } from './client'

export type ResolvedField = { data: unknown } | { error: string }

type FieldPath = { label: string; path: string; type?: string | null }

function flattenFields(
  root: TypeFragment,
  fields: FieldPath[] = [],
  path: string[] = []
): FieldPath[] {
  if (!root?.fields) return fields

  root.fields.forEach(field => {
    const newPath = [...path, field.name]

    fields.push({
      label: [field.name, ...path.reverse()].join(' < '),
      path: newPath.join('.'),
      type: field.type?.name ?? 'unknown',
    })

    flattenFields(field.type, fields, newPath)
  })

  return fields
}

export function resolvePath<T extends string>(
  path: string | Array<T>,
  obj?: { [key: string]: any } | null,
  separator: string = '.'
): any {
  const properties = Array.isArray(path) ? path : path.split(separator)

  return properties.reduce((prev, curr) => prev?.[curr], obj ?? {})
}

export const isRichText = (
  field: any
): field is StructuredTextGraphQlResponse<SingleImageFragment> =>
  field?.__typename === 'BlogModelBodyField'

export const isDatoImage = (field: any): field is ResponsiveImageType =>
  field?.__typename === 'ResponsiveImage'

// List all the fields of a given type, optionally filtered by type and search query
export async function getFieldOptions({
  type,
  filter,
  query,
}: {
  type: 'BlogRecord'
  filter?: (type?: string | null) => boolean
  query: string
}): Promise<{ id: string; label: string; value: string }[]> {
  const data = await client.request(TypesDocument, { name: type })

  if (!data.__type) return []

  return flattenFields(data.__type)
    .filter(field => (filter ? filter(field.type) : true))
    .filter(field => field.label.toLowerCase().includes(query.toLowerCase()))
    .map(field => ({ id: field.path, label: field.label, value: field.path }))
    .sort(field => (field.value.split('<').length > 1 ? 1 : -1))
}
