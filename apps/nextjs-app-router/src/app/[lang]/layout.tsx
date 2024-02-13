import { RootStyleRegistry } from '@makeswift/runtime/next'

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
      <body>
        <RootStyleRegistry>{children}</RootStyleRegistry>
      </body>
    </html>
  )
}
