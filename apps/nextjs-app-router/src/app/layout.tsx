import { MakeswiftProvider } from '@/makeswift/provider'
import { DraftModeScript } from '@makeswift/runtime/next/server'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <head>
        <DraftModeScript />
      </head>
      <body>
        <MakeswiftProvider>{children}</MakeswiftProvider>
      </body>
    </html>
  )
}
