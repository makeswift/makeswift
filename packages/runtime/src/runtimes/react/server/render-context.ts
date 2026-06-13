import 'server-only'

import { ReactRuntime } from '../../react/react-runtime'
import { type SiteVersion } from '../../../api/site-version'
import { MakeswiftClient } from '../../../client'
import { type Document } from '../../../state/read-only-state'

export type ServerRenderBaseContext = {
  runtime: ReactRuntime
  client: MakeswiftClient
  siteVersion: SiteVersion | null
}

export type ServerRenderContext = ServerRenderBaseContext & {
  document: Document
}

export const createServerRenderContext = (
  baseContext: ServerRenderBaseContext,
  document: Document,
): ServerRenderContext => ({
  ...baseContext,
  document,
})

export const getStore = (context: ServerRenderBaseContext) => context.runtime.protoStore
