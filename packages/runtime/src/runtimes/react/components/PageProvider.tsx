import { ComponentPropsWithoutRef } from 'react'
import { PageContext } from '../hooks/use-page-id'

type PageProviderProps = {
  id: string
  children: ComponentPropsWithoutRef<(typeof PageContext)['Provider']>['children']
}

export function PageProvider({ id, children }: PageProviderProps) {
  return <PageContext.Provider value={id}>{children}</PageContext.Provider>
}
