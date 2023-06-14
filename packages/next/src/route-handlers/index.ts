import { NextRequest, NextResponse } from 'next/server'
import { Match, match as matchPattern } from 'path-to-regexp'

import {
  MakeswiftApiKeyError,
  MakeswiftRouteHandlerCatchAllError,
} from './errors'
import { Makeswift } from '@makeswift/runtime/next'
import { manifestHandler } from './handlers/manifest'
import { MakeswiftRouteHandlerConfig } from './types'

interface MakeswiftRouteHandlerParams {
  params: {
    makeswift: string[]
  }
}

const getMatcher =
  (action: string) =>
  <T extends Record<string, unknown>>(pattern: string): Match<T> =>
    matchPattern<T>(pattern, { decode: decodeURIComponent })(action)

export function unstable_MakeswiftRouteHandler({
  appOrigin = 'https://app.makeswift.com',
  apiOrigin = 'https://api.makeswift.com',
  apiKey,
  unstable_siteVersions = false,
}: MakeswiftRouteHandlerConfig) {
  const config: Required<MakeswiftRouteHandlerConfig> = {
    apiKey,
    appOrigin,
    apiOrigin,
    unstable_siteVersions,
  }

  if (!apiKey) {
    throw new MakeswiftApiKeyError(apiKey)
  }

  return {
    GET: async (
      request: NextRequest,
      { params }: MakeswiftRouteHandlerParams,
    ): Promise<NextResponse> => {
      const { makeswift } = params

      if (!Array.isArray(makeswift)) {
        throw new MakeswiftRouteHandlerCatchAllError(makeswift)
      }

      // previewData is now considered legacy, and is now replaced by draftMode
      // We need to update next to the latest in order to use draftMode
      const client = new Makeswift(apiKey, { apiOrigin })
      const url = `/${makeswift.join('/')}`
      const matches = getMatcher(url)

      // Noop'ing for now until usage
      void client

      const headers = new Headers({
        'Access-Control-Allow-Origin': appOrigin,
      })

      if (matches('/manifest')) {
        return manifestHandler(request, headers, config)
      }

      return NextResponse.json(
        { message: 'Not found' },
        { status: 404, headers },
      )
    },
  }
}
