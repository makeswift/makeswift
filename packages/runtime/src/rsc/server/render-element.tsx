import { type ReactNode } from 'react'
import { type ElementData } from '@makeswift/controls'
import { ServerElementData } from './server-element-data'
import { setRuntime, setSiteVersion, setMakeswiftClient, setDocument } from './runtime'
import { type MakeswiftClient } from '../../client'
import { type SiteVersion } from '../../api/site-version'
import { registerDocument } from '../../state/shared-api'

type RenderElementContextProps = {
  runtime: Parameters<typeof setRuntime>[0]
  client: MakeswiftClient
  siteVersion: SiteVersion | null
  documentKey: string
  locale: string | null
  elementData: ElementData
}

/**
 * Server component that sets up the React.cache-scoped context needed for
 * rendering a single ServerElementData. This is used by the /__rsc-element
 * endpoint for V2 subtree replacement.
 *
 * Sets up the same server state that RSCServerProvider + prerenderRSCNodes
 * would set up for a full-page render, but scoped to a single element.
 */
export function RenderElementContext({
  runtime,
  client,
  siteVersion,
  documentKey,
  locale,
  elementData,
}: RenderElementContextProps): ReactNode {
  // Set up per-render server state via React.cache()
  setRuntime(runtime)
  setSiteVersion(siteVersion)
  setMakeswiftClient(client)

  // Create a minimal document for the resource resolver (needs key + locale)
  const minimalDocument = {
    key: documentKey,
    rootElement: elementData,
    locale,
  }
  setDocument(minimalDocument)

  // Register the document so the runtime store has it
  runtime.store.dispatch(registerDocument(minimalDocument))

  return <ServerElementData elementData={elementData} />
}
