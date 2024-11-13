import { CssTheme } from '@/makeswift/components/css-theme'
import { MakeswiftProvider } from '@/makeswift/provider'
import { DraftModeScript } from '@makeswift/runtime/next/server'
import { draftMode } from 'next/headers'

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
      <MakeswiftProvider
        previewMode={(await draftMode()).isEnabled}
        locale={lang}
      >
        <head>
          <DraftModeScript appOrigin={process.env.MAKESWIFT_APP_ORIGIN} />
          <CssTheme colors={{}} />
        </head>
        <body>{children}</body>
      </MakeswiftProvider>
    </html>
  )
}
