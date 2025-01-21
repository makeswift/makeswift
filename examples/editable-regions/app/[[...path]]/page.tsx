import { Slot, client } from '@/lib/makeswift'

type PageParams = { path?: string[] }

export async function generateStaticParams() {
  return await client
    .getPages()
    .map(page => ({
      path: page.path.split('/').filter(segment => segment !== ''),
    }))
    .toArray()
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { path: pathSegments } = await params
  const path = '/' + (pathSegments ?? []).join('/')

  return (
    <Slot
      snapshotId={`main-content-${path}`}
      label={`Main content (${path})`}
      fallback={
        <div className="flex flex-col gap-y-4 px-2 py-8">
          <h2 className="text-3xl font-bold capitalize">
            {(pathSegments ?? ['Home page']).join(' / ')}
          </h2>
          <p>Toggle "Use fallback" checkbox in the builder to start editing this page's content</p>
        </div>
      }
    />
  )
}
