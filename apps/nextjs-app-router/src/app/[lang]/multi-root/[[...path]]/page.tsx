import { client } from '@/makeswift/client'
import { Slot } from '@/makeswift/slot'

type ParsedUrlQuery = Promise<{ lang: string; path?: string[] }>

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
  const { path: pathSegments, lang } = await params
  const path = '/' + (pathSegments ?? []).join('/')

  return (
    <Slot
      snapshotId={`main-content-${path}`}
      locale={lang}
      label={`Main content (${path})`}
      fallback={
        <div className="flex flex-col gap-y-4 px-2 py-8">
          <h2 className="text-3xl font-bold capitalize">
            {(pathSegments ?? ['Home page']).join(' / ')}: Region 1
          </h2>
          <p>
            {`Toggle "Use fallback" checkbox in the builder to start editing this
            region's content`}
          </p>
        </div>
      }
    />
  )
}
