import { ReactRuntime } from '../../../runtimes/react/react-runtime'
import { Page, PageProps } from '../../components/page'
import { getSiteVersion } from '../../app-router-site-version'
import { RuntimeProvider } from '../components/RuntimeProvider'
import { serializeServerState } from '../serialization/serialization'
import { Makeswift } from '../../client'
import { notFound } from 'next/navigation'

type Props = {
  runtime: ReactRuntime
  path: string
  siteApiKey: string
  locale?: string
  metadata?: PageProps['metadata']
  apiOrigin?: string
}

export async function MakeswiftPage(props: Props) {
  const siteVersion = await getSiteVersion()
  const client = new Makeswift(props.siteApiKey, {
    runtime: props.runtime,
    apiOrigin: props.apiOrigin,
  })
  const snapshot = await client.getPageSnapshot(props.path, {
    siteVersion: getSiteVersion(),
    locale: props.locale,
  })

  if (snapshot == null) return notFound()

  return (
    <RuntimeProvider
      siteVersion={siteVersion}
      serializedServerState={serializeServerState(props.runtime.store.getState())}
    >
      <Page snapshot={snapshot} metadata={props.metadata} />
    </RuntimeProvider>
  )
}
