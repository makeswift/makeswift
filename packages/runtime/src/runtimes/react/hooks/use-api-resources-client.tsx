'use client'

import { ApiResourcesClient } from '../../../api/api-resources-client'

import { useStore } from './use-store'

export function useApiResourcesClient(): ApiResourcesClient {
  return useStore().apiResourcesClient
}
