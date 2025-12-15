import React from 'react'
import { MakeswiftProvider } from '@/makeswift/provider'

import '@/makeswift/components'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { Footer } from './footer'

type Params = Promise<{ lang: string; path?: string[] }>

export default async function PageLayout({
  children: mainRegion,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Params
}>) {
  const { lang } = await params
  const siteVersion = await getSiteVersion()

  return (
    <>
      <div>
        <h1 className="text-4xl text-center py-12 font-semibold bg-slate-300">
          Multi-region page
        </h1>
      </div>
      <MakeswiftProvider siteVersion={siteVersion} locale={lang}>
        {mainRegion}
      </MakeswiftProvider>
      <div className="text-2xl text-center font-semibold py-8 bg-slate-300">
        This stuff is fun, and fun is good!
      </div>
      <MakeswiftProvider siteVersion={siteVersion} locale={lang}>
        <Footer lang={lang} />
      </MakeswiftProvider>
    </>
  )
}
