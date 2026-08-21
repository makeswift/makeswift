import { cache, type PropsWithChildren } from 'react'

import { ReactRuntime } from '../../react/react-runtime'
import { type Store } from '../../../state/store'

import { type SiteVersion } from '../../../api/site-version'
import { MakeswiftClient } from '../../../client'
import { type RootStyleProps } from '../root-style-registry'

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
  rootStyleProps: RootStyleProps
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

export const getStore = ({ runtime, siteVersion, locale }: ServerRenderContext): Store => {
  if (runtime.requestKey == null) {
    throw Error('Expected a runtime instance that is bound to a specific request key')
  }

  return runtime.getOrCreateStore({ siteVersion, locale })
}

export const RenderContext = ({
  context,
  children,
}: PropsWithChildren<{ context: ServerRenderContext }>) => {
  setRenderContext(context)
  return children
}
