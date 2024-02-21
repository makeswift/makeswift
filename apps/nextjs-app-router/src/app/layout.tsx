import { MakeswiftProvider } from '@/makeswift/provider'
import { DraftModeScript } from '@makeswift/runtime/next/server'

type Params = { lang: string; path?: string[] }

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Params
}>) {
  return (
    <html lang={'en-US'}>
      <head>
        <DraftModeScript />
      </head>
      <body>
        <MakeswiftProvider>{children}</MakeswiftProvider>
      </body>
    </html>
  )
}
