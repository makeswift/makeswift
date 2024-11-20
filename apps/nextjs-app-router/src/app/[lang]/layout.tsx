import { MakeswiftProvider } from '@/makeswift/provider'
import { DraftModeScript } from '@makeswift/runtime/next/server'
import { draftMode } from 'next/headers'

import '@/app/global.css'
import '@/makeswift/components'

type Params = Promise<{ lang: string; path?: string[] }>

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Params
}>) {
  const { lang } = await params
  return (
    <html lang={lang}>
      <head>
        <DraftModeScript appOrigin={process.env.MAKESWIFT_APP_ORIGIN} />
      </head>
      <body>
        <MakeswiftProvider
          previewMode={(await draftMode()).isEnabled}
          locale={lang}
        >
          {children}
        </MakeswiftProvider>
      </body>
    </html>
  )
}
