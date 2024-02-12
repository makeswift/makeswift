import { MakeswiftProvider } from './makeswift-provider'
import { DraftModeScript } from '@makeswift/runtime/next'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <DraftModeScript />
      </head>
      <body>
        <MakeswiftProvider>{children}</MakeswiftProvider>
      </body>
    </html>
  )
}
