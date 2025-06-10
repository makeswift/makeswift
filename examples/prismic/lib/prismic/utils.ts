import { ImageFieldImage, RichTextField } from '@prismicio/client'

import { Blogpost, TypeFragment, TypesDocument } from '@/generated/prismic'
import { client } from '@/lib/prismic/client'
import { usePrismicData } from '@/lib/prismic/provider'

type PrismicEntry = { __typename: 'Blogpost' } & Blogpost
type EntryType = 'Blogpost'

type FieldPath = { label: string; path: string; type?: string | null }

export type ResolvedField = { data: unknown } | { error: string }

const isRichTextField = (fieldType: TypeFragment) =>
  fieldType.fields?.find(f => f.name === 'json') && fieldType.fields?.find(f => f.name === 'links')

function flattenFields(
  root: TypeFragment,
  fields: FieldPath[] = [],
  path: string[] = []
): FieldPath[] {
  if (!root.fields) return fields

  root.fields.forEach(field => {
    const newPath = [...path, field.name]

    fields.push({
      label: [field.name, ...path.slice().reverse()].join(' < '),
      path: newPath.join('.'),
      type: isRichTextField(field.type) ? 'RichText' : field.type.name,
    })

    flattenFields(field.type, fields, newPath)
  })

  return fields
}

export async function getFieldOptions({
  type,
  filter,
  query,
}: {
  type: EntryType
  filter?: ((type?: string | null) => boolean) | string[]
  query: string
}): Promise<{ id: string; label: string; value: string }[]> {
  const data = await client.request(TypesDocument, { name: type })

  if (!data.__type) return []

  return flattenFields(data.__type)
    .filter(field => {
      if (typeof filter === 'function') {
        return filter(field.type)
      }
      if (Array.isArray(filter)) {
        return filter.includes(field.path.split('.').pop() || '')
      }
      return true
    })
    .filter(field => field.label.toLowerCase().includes(query.toLowerCase()))
    .map(field => ({ id: field.path, label: field.label, value: field.path }))
}

export function resolvePath<T extends string>(
  path: string | Array<T>,
  obj?: { [key: string]: any } | null,
  separator: string = '.'
): any {
  const properties = Array.isArray(path) ? path : path.split(separator)

  return properties.reduce((prev, curr) => prev?.[curr], obj ?? {})
}

function isEntryType(data: unknown, type: EntryType): data is PrismicEntry {
  if (typeof data !== 'object' || data === null) return false
  const meta = data as { _meta?: { type?: string } }
  return '_meta' in data && meta._meta?.type === type.toLowerCase()
}

export function useEntryField({
  fieldPath,
  type,
}: {
  fieldPath?: string
  type: EntryType
}): ResolvedField {
  const { data, error } = usePrismicData()

  if (error) return { error: 'No entry found.' }

  if (!fieldPath) return { error: 'Field path is not set.' }

  if (!isEntryType(data, type)) {
    return { error: `Invalid ${type} data structure.` }
  }

  const field = resolvePath(fieldPath, data)

  if (!field) return { error: `Cannot find field at ${fieldPath}. Check the graphql query.` }

  return { data: field }
}

export function isPrismicImage(field: unknown): field is ImageFieldImage {
  return (
    typeof field === 'object' && field !== null && 'url' in field && typeof field.url === 'string'
  )
}

export function isPrismicRichText(field: unknown): field is RichTextField {
  return typeof field === 'object' && field !== null
}
