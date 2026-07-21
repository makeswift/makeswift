import { getSiteVersion } from '@makeswift/hono-react/server'
import { Makeswift as MakeswiftClient } from '@makeswift/hono-react'
import { type Context, type Next } from 'hono'

import { type HonoEnv } from '../../hono'

import { createRuntime } from '../runtime'
import { MAKESWIFT_SITE_API_KEY } from '../env'

/**
 * A new runtime is created for each request to isolate Redux store state
 * (siteVersion, locale, API resource cache) between concurrent requests
 * sharing the same Cloudflare Worker isolate.
 */
export function withMakeswift() {
  return async (c: Context<HonoEnv>, next: Next) => {
    const siteVersion = await getSiteVersion(c)
    const runtime = createRuntime({
      requestKey: { siteVersion, locale: undefined },
      apiKey: MAKESWIFT_SITE_API_KEY,
    })

    c.set('makeswiftRuntime', runtime)
    c.set(
      'makeswiftClient',
      new MakeswiftClient(MAKESWIFT_SITE_API_KEY, { runtime }),
    )

    c.set('siteVersion', siteVersion)

    return next()
  }
}
