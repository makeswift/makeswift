'use client'

import { createContext, ReactNode, useContext, useEffect } from 'react'
import { setRSCElementKeys } from '../../state/actions'
import { useDispatch } from '../../runtimes/react/hooks/use-dispatch'

type RSCNodes = Record<string, JSX.Element>

const RSCNodesContext = createContext<RSCNodes>({})

export const RSCNodesProvider = ({ children, value }: { children: ReactNode; value: RSCNodes }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const keys = Object.keys(value)
    dispatch(setRSCElementKeys(keys))
  }, [value, dispatch])

  return <RSCNodesContext.Provider value={value}>{children}</RSCNodesContext.Provider>
}

export const useRSCNodes = () => {
  return useContext(RSCNodesContext)
}
