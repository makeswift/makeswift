'use client'

import { ReactNode, createContext, useContext } from 'react'
import { MakeswiftHostApiClient } from '../../api/client'

const Context = createContext(
  new MakeswiftHostApiClient({
    uri: 'https://api.makeswift.com/graphql',
    fetch: async (url, init) => {
      console.warn(
        'Using fallback `fetch` implementation, resource revalidation may not work as expected.',
        { url },
      )
      return fetch(url, init)
    },
  }),
)

export function useMakeswiftHostApiClient(): MakeswiftHostApiClient {
  return useContext(Context)
}

export function MakeswiftHostApiClientProvider({
  client,
  children,
}: {
  client: MakeswiftHostApiClient
  children: ReactNode
}) {
  return <Context.Provider value={client}>{children}</Context.Provider>
}
