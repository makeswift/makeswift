import { createContext, useContext } from 'react'

export const DisableRegisterElement = createContext(false)

export function useIsRegisterElementDisabled() {
  return useContext(DisableRegisterElement)
}
