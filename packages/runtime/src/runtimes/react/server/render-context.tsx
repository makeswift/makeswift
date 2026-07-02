import 'server-only'
import { cache, type PropsWithChildren } from 'react'

import { ReactRuntime } from '../../react/react-runtime'
import { type SiteVersion } from '../../../api/site-version'
import { MakeswiftClient } from '../../../client'

import { ServerCSSCollector } from './css/server-css'

export type ServerRenderContext = {
  request: Request
  runtime: ReactRuntime
  client: MakeswiftClient
  cssCollector: ServerCSSCollector
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

export const getStore = ({ runtime, siteVersion, locale }: ServerRenderContext) =>
  runtime.getOrCreateStore({ siteVersion, locale })

export const RenderContext = ({
  context,
  children,
}: PropsWithChildren<{ context: ServerRenderContext }>) => {
  setRenderContext(context)
  return children
}
