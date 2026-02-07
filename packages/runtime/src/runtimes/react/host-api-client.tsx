'use client'

import { MakeswiftHostApiClient } from '../../api/client'

import { useReactRuntime } from './hooks/use-react-runtime'

export function useMakeswiftHostApiClient(): MakeswiftHostApiClient {
  return useReactRuntime().hostApiClient
}
