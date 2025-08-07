import { createContext, ReactNode } from 'react'

export const PropsContext = createContext<{
  fallback: ReactNode
}>({
  fallback: null,
})

export function SlotProvider({
  value,
  children,
}: {
  value: { fallback: ReactNode }
  children: ReactNode
}) {
  return <PropsContext.Provider value={value}>{children}</PropsContext.Provider>
}
