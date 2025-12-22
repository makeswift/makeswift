'use client'

import { MakeswiftHostApiClient } from '../../api/client'

import { useReactRuntime } from './hooks/use-react-runtime'

// const Context = createContext(
//   new MakeswiftHostApiClient({
//     uri: 'https://api.makeswift.com/graphql',
//     fetch: async (url, init) => {
//       console.warn(
//         'Using fallback `fetch` implementation, resource revalidation may not work as expected.',
//         { url },
//       )
//       return fetch(url, init)
//     },
//   }),
// )

export function useMakeswiftHostApiClient(): MakeswiftHostApiClient {
  return useReactRuntime().hostApiClient
}
