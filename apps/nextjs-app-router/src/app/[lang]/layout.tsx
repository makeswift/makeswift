import { MakeswiftProvider } from '@/makeswift/provider'
import { DraftModeScript } from '@makeswift/runtime/next/server'
import { draftMode } from 'next/headers'

type Params = { lang: string; path?: string[] }

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Params
}>) {
  return (
    <html lang={params.lang}>
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
