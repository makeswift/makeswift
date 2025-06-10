import { ResponsiveImageType, StructuredTextGraphQlResponse } from 'react-datocms'

import { BlogpostRecord, TypeFragment, TypesDocument } from '@/generated/dato'

import { client } from './client'
import { useDatoData } from './provider'

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
      type: isRichTextField(field.type) ? 'BlogpostModelBodyField' : field.type.name,
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

const isRichTextField = (fieldType: TypeFragment) => {
  return fieldType.fields?.find(f => f.name === 'BlogpostModelBodyField')
}
export const isRichText = (field: any): field is StructuredTextGraphQlResponse => {
  return field?.__typename === 'BlogpostModelBodyField'
}
export const isDatoImage = (field: any): field is ResponsiveImageType =>
  field?.__typename === 'ResponsiveImage'

// List all the fields of a given type, optionally filtered by type and search query
export async function getFieldOptions({
  type,
  filter,
  query,
}: {
  type: EntryType
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

type DatoEntry = { __typename: 'BlogpostRecord' } & BlogpostRecord
type EntryType = 'BlogpostRecord'

function isEntryType(data: unknown, type: EntryType): data is DatoEntry {
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
  const { data, error } = useDatoData()

  if (error) return { error: 'No entry found.' }

  if (!fieldPath) return { error: 'Field path is not set.' }

  if (!isEntryType(data, type)) {
    return { error: `Invalid ${type} data structure.` }
  }

  const field = resolvePath(fieldPath, data)

  if (!field) return { error: `Cannot find field at ${fieldPath}. Check the graphql query.` }

  return { data: field }
}
