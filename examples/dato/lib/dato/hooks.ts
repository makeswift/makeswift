import { BlogpostRecord } from '@/generated/dato'

import { useDatoData } from './provider'

type EntryType = 'BlogpostRecord'
type DatoEntry = { __typename: 'BlogpostRecord' } & BlogpostRecord

export type ResolvedField = { data: unknown } | { error: string }

export function resolvePath<T extends string>(
  path: string | Array<T>,
  obj?: { [key: string]: any } | null,
  separator: string = '.'
): any {
  const properties = Array.isArray(path) ? path : path.split(separator)

  return properties.reduce((prev, curr) => prev?.[curr], obj ?? {})
}

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
