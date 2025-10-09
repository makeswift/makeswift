import { AuthorRecord, BlogpostRecord, FileField } from '@/generated/dato'

export type ResolvedField = { data: unknown } | { error: string }

export const isStructuredText = (field: any): field is { value: any; blocks: any; links: any } =>
  field?.value && typeof field.value === 'object'

export const isFileField = (field: any): field is FileField => {
  return field?.__typename === 'FileField'
}

export function resolvePath<T extends string>(
  path: string | Array<T>,
  obj?: { [key: string]: any } | null,
  separator: string = '.'
): any {
  const properties = Array.isArray(path) ? path : path.split(separator)

  return properties.reduce((prev, curr) => prev?.[curr], obj ?? {})
}

type DatoEntry = ({ __typename: 'BlogpostRecord' } & BlogpostRecord) | ({ __typename: 'AuthorRecord' } & AuthorRecord)
type EntryType = 'BlogpostRecord' | 'AuthorRecord'

function isEntryType(data: unknown, type: EntryType): data is DatoEntry {
  if (typeof data !== 'object' || data === null) return false

  return '__typename' in data && data.__typename === type
}

export function useEntryField({
  fieldPath,
  type,
  data,
  error,
}: {
  fieldPath?: string
  type: EntryType
  data: unknown
  error?: string
}): ResolvedField {
  if (error) return { error: 'No entry found.' }

  if (!fieldPath) return { error: 'Field path is not set.' }

  if (!isEntryType(data, type)) {
    return { error: `Invalid ${type} data structure.` }
  }

  const field = resolvePath(fieldPath, data)

  if (!field) return { error: `Cannot find field at ${fieldPath}. Check the graphql query.` }

  return { data: field }
}

export const isStructuredTextField = (fieldType: any) =>
  fieldType.fields?.find((f: any) => f.name === 'value') && 
  fieldType.fields?.find((f: any) => f.name === 'blocks')
