import { cache, type PropsWithChildren } from 'react'

import { ReactRuntime } from '../../react/react-runtime'
import { type Store } from '../../../state/store'

import { type SiteVersion } from '../../../api/site-version'
import { MakeswiftClient } from '../../../client'

/**
 * Request-scoped dependencies used to render Makeswift server elements.
 *
 * Framework integrations create a context for each request and install it with
 * `RenderContext` or `setRenderContext` so nested renderers can access it without
 * threading it through every component. The runtime must be request-bound;
 * together with `siteVersion` and `locale`, it selects the store and API resource
 * cache used during rendering.
 */
export type ServerRenderContext = {
  request: Request
  runtime: ReactRuntime
  client: MakeswiftClient
  siteVersion: SiteVersion | null
  locale: string | undefined
  store: Store
}

const requestContext = cache((): { current?: ServerRenderContext } => ({}))

export const setRenderContext = (context: ServerRenderContext) => {
  requestContext().current = context
}

export const getRenderContext = (): ServerRenderContext => {
  const context = requestContext().current
  if (!context) throw Error('Makeswift render context was not set.')
  return context
}

export const getStore = ({ store }: ServerRenderContext): Store => store

export const RenderContext = ({
  context,
  children,
}: PropsWithChildren<{ context: ServerRenderContext }>) => {
  setRenderContext(context)
  return children
}
