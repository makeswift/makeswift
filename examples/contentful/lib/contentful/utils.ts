import { Document } from '@contentful/rich-text-types'

import { Asset, BlogPostBodyLinks, TypeFragment, TypesDocument } from '@/generated/contentful'
import { client } from '@/lib/contentful/client'
import { useContentfulData } from '@/lib/contentful/provider'

type FieldPath = { label: string; path: string; type?: string | null }

export type ResolvedField = { data: unknown } | { error: string }

const isRichTextField = (fieldType: TypeFragment) =>
  fieldType.fields?.find(f => f.name === 'json') && fieldType.fields?.find(f => f.name === 'links')

export const isRichText = (field: any): field is { json: Document; links: BlogPostBodyLinks } =>
  field?.json?.nodeType === 'document'

export const isAsset = (field: any): field is Asset => {
  return field?.__typename === 'Asset'
}

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
  type: 'BlogPost' | 'Author'
  filter?: (type?: string | null) => boolean
  query: string
}): Promise<{ id: string; label: string; value: string }[]> {
  const data = await client.request(TypesDocument, { name: type })

  if (!data.__type) return []

  return flattenFields(data.__type)
    .filter(field => (filter ? filter(field.type) : true))
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

export function useEntryField({ fieldPath }: { fieldPath?: string }): ResolvedField {
  const { data, error } = useContentfulData()

  if (error) return { error: 'No entry found.' }

  if (!fieldPath) return { error: 'Field path is not set.' }

  const field = resolvePath(fieldPath, data)

  if (!field) return { error: `Cannot find field at ${fieldPath}. Check the graphql query.` }

  return { data: field }
}
