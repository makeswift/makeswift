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
      <div className="text-center bg-slate-300">
        <h1 className="text-4xl pt-12 font-semibold ">
          Multi-root regions demo
        </h1>
        <p className="text-xl font-semibold py-4">
          The regions on this page are independent roots, each with their own
          Makeswift provider
        </p>
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
