import { useQuery } from '@apollo/client'

import { FILE_BY_ID } from '../utils/queries'

type File = {
  id: string
  name: string
  publicUrl: string
  extension: string
  dimensions: { width: number; height: number } | null
}

export function useFile(fileId: string | null | undefined): File | null | undefined {
  const { error, data = {} } = useQuery(FILE_BY_ID, {
    skip: fileId == null,
    variables: { id: fileId },
  })

  if (fileId == null || error != null) return null

  return data.file
}
