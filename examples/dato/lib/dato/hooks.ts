import { ResolvedField, useEntryField as useEntryFieldUtil } from './utils'
import { useDatoData } from './provider'

type EntryType = 'BlogpostRecord' | 'AuthorRecord'

export function useEntryField({
  fieldPath,
  type,
}: {
  fieldPath?: string
  type: EntryType
}): ResolvedField {
  const { data, error } = useDatoData()

  return useEntryFieldUtil({ fieldPath, type, data, error })
}
