import { client } from '@/makeswift/client'
import '@/makeswift/components'
import { getSiteVersion } from '@makeswift/runtime/next/server'
import { Page as MakeswiftPage, MultiProvider } from '@makeswift/runtime/next'

type ParsedUrlQuery = { lang: string; path?: string[] }

export async function generateStaticParams() {
  const pages = await client.getPages().toArray()

  return pages.flatMap((page) => [
    {
      params: {
        path: page.path.split('/').filter((segment) => segment !== ''),
        lang: page.locale,
      },
    },
    ...page.localizedVariants.map((variant) => ({
      params: {
        path: variant.path.split('/').filter((segment) => segment !== ''),
        lang: variant.locale,
      },
    })),
  ])
}

export default async function Page({ params }: { params: ParsedUrlQuery }) {
  const alphaSnapshot = await client.getPageSnapshot('/alpha', {
    siteVersion: getSiteVersion(),
    locale: params.lang,
  })

  const betaSnapshot = await client.getPageSnapshot('/bravo', {
    siteVersion: getSiteVersion(),
    locale: params.lang,
  })

  if (alphaSnapshot == null) return <div>Alpha not found</div>
  if (betaSnapshot == null) return <div>Beta not found</div>

  console.log({ alphaSnapshot, betaSnapshot })

  const preview = getSiteVersion() === 'Working'
  return (
    <div>
      <MultiProvider preview={preview} snapshot={alphaSnapshot}>
        <MakeswiftPage snapshot={alphaSnapshot} />
        <div
          style={{
            height: '12px',
            width: '100%',
            background: '#000',
          }}
        />
        <MakeswiftPage snapshot={betaSnapshot} />
      </MultiProvider>
    </div>
  )
}
