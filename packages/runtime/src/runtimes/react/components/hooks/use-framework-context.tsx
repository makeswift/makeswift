import { useContext } from 'react'

import { FrameworkContext } from '../framework-context'

export function useFrameworkContext() {
  return useContext(FrameworkContext)
}
