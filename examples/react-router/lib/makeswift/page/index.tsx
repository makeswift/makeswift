import { Page as MakeswiftPage } from '@makeswift/react-router'

import { MakeswiftProvider } from 'lib/makeswift/provider'

import { type LoaderData } from './loader'

type ComponentProps = {
  loaderData: LoaderData
}

export function Page({ loaderData }: ComponentProps) {
  const { snapshot, siteVersion } = loaderData ?? {}

  if (snapshot == null) {
    throw new Response('Not Found', { status: 404, statusText: 'Page not found' })
  }

  return (
    <MakeswiftProvider siteVersion={siteVersion}>
      <MakeswiftPage snapshot={snapshot} />
    </MakeswiftProvider>
  )
}

export default Page
