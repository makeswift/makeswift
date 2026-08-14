import { cache, type PropsWithChildren } from 'react'

import { ReactRuntime } from '../../react/react-runtime'
import { type Store } from '../../../state/store'

import { type SiteVersion } from '../../../api/site-version'
import { MakeswiftClient } from '../../../client'

export type ServerRenderContext = {
  request: Request
  runtime: ReactRuntime
  client: MakeswiftClient
  siteVersion: SiteVersion | null
  locale: string | undefined
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
  if (runtime.requestKey == null)
    throw Error('Expected a runtime instance that is bound to a specific request key')

  return runtime.getOrCreateStore({ siteVersion, locale })
}

export const RenderContext = ({
  context,
  children,
}: PropsWithChildren<{ context: ServerRenderContext }>) => {
  setRenderContext(context)
  return children
}
