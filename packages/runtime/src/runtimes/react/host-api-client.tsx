'use client'

import { ReactNode, createContext, useContext } from 'react'
import { MakeswiftHostApiClient } from '../../api/react'
import { MakeswiftSiteVersion } from '../../api/site-version'

const Context = createContext(
  new MakeswiftHostApiClient({
    uri: 'https://api.makeswift.com/graphql',
    siteVersion: MakeswiftSiteVersion.Live,
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
