import { SiteFooter } from '@/lib/makeswift/components/site-footer'
import { SiteHeader } from '@/lib/makeswift/components/site-header'

export default async function DefaultLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-screen-2xl px-4 py-6 @xl:px-6 @xl:py-10 @4xl:px-8 @4xl:py-12">
        {children}
      </main>

      <SiteFooter />
    </>
  )
}

export const experimental_ppr = true
