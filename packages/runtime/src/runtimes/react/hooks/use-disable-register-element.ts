import { createContext, useContext } from 'react'

export const DisableRegisterElement = createContext(false)

export function useDisableRegisterElement() {
  return useContext(DisableRegisterElement)
}
