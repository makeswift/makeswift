import { getSiteVersion, withMakeswift } from '@makeswift/react-router/server'

import { client } from 'lib/makeswift/client'

type LoaderArgs = {
  request: Request
  params:
    | {}
    | {
        '*': string
      }
}

export const loader = withMakeswift(
  async ({ request, params }: LoaderArgs) => {
    const path = `/${'*' in params ? params['*'] : ''}`

    const siteVersion = await getSiteVersion(request)
    const snapshot = await client.getPageSnapshot(path, {
      siteVersion,
    })

    return {
      snapshot,
      siteVersion,
    }
  },
  { client }
)

export type LoaderData = Exclude<Awaited<ReturnType<typeof loader>>, Response>
