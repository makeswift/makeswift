'use client'

import { createContext, PropsWithChildren, useContext } from 'react'

type ContextProps = {
  html: string
}

const PropsContext = createContext<ContextProps>({
  html: '',
})

export const PropsContextProvider = ({
  value,
  children,
}: PropsWithChildren<{ value: ContextProps }>) => (
  <PropsContext.Provider value={value}>{children}</PropsContext.Provider>
)

export function MakeswiftTransformer() {
  const context = useContext(PropsContext)

  return <div dangerouslySetInnerHTML={{ __html: context.html }} />
}
