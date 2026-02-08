import { MakeswiftProvider } from '@/makeswift/provider'

import '@/makeswift/components'
import { getSiteVersion } from '@makeswift/runtime/next/server'

type Params = Promise<{ lang: string; path?: string[] }>

export default async function PageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Params
}>) {
  const { lang } = await params
  return (
    <MakeswiftProvider siteVersion={await getSiteVersion()} locale={lang}>
      {children}
    </MakeswiftProvider>
  )
}
