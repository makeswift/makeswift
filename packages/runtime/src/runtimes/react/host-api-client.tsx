'use client'

import { MakeswiftHostApiClient } from '../../api/client'

import { useStore } from './hooks/use-store'

export function useMakeswiftHostApiClient(): MakeswiftHostApiClient {
  return useStore().hostApiClient
}
