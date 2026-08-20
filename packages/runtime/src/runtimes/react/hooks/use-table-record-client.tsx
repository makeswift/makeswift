'use client'

import { MakeswiftTableRecordClient } from '../../../api/table-record-client'

import { useReactRuntime } from './use-react-runtime'

export function useTableRecordClient(): MakeswiftTableRecordClient {
  const runtime = useReactRuntime()
  return new MakeswiftTableRecordClient({ fetch: runtime.fetch })
}
