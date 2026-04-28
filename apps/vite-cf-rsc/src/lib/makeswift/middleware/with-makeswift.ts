import { getSiteVersion } from '@makeswift/hono-react/server'
import { type Context, type Next } from 'hono'

import { type HonoEnv } from '../../hono'
import { runtime } from '../runtime'
import { client } from '../client'

/**
 * A new runtime is created for each request to isolate Redux store state
 * (siteVersion, locale, API resource cache) between concurrent requests
 * sharing the same Cloudflare Worker isolate.
 */
export function withMakeswift() {
  return async (c: Context<HonoEnv>, next: Next) => {
    const siteVersion = await getSiteVersion(c)
    // const runtime = createRuntime({ siteVersion })

    c.set('makeswiftRuntime', runtime)
    c.set('makeswiftClient', client)
    c.set('siteVersion', siteVersion)

    return next()
  }
}
