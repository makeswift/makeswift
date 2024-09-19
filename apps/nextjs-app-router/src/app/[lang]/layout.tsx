import { MakeswiftProvider } from '@/makeswift/provider'
import { DraftModeScript } from '@makeswift/runtime/next/server'
import { draftMode } from 'next/headers'

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
          previewMode={draftMode().isEnabled}
          locale={params.lang}
        >
          {children}
        </MakeswiftProvider>
      </body>
    </html>
  )
}
