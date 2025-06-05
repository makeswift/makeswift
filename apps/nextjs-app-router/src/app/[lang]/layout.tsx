import { MakeswiftProvider } from '@/makeswift/provider'
import { draftMode } from 'next/headers'
import { Grenze_Gotisch, Grenze } from 'next/font/google'

import '@/app/global.css'
import '@/makeswift/components'
import { getSiteVersion } from '@makeswift/runtime/next/server'

type Params = Promise<{ lang: string; path?: string[] }>

const GrenzeGotischFont = Grenze_Gotisch({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-grenze-gotisch',
})

const GrenzeFont = Grenze({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-grenze',
})

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Params
}>) {
  const { lang } = await params
  const siteVersion = await getSiteVersion()

  return (
    <html
      lang={lang}
      className={`${GrenzeGotischFont.variable} ${GrenzeFont.variable}`}
    >
      <body>
        <MakeswiftProvider
          previewMode={siteVersion === 'Working'}
          locale={lang}
        >
          {children}
        </MakeswiftProvider>
      </body>
    </html>
  )
}
