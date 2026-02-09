'use client'

import { type Store } from '../../../state/store'
import { useReactRuntime } from './use-react-runtime'

export function useStore(): Store {
  return useReactRuntime().store
}
