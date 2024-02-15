import { MakeswiftProvider } from '@/makeswift/provider'

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
        <MakeswiftProvider>{children}</MakeswiftProvider>
      </body>
    </html>
  )
}
