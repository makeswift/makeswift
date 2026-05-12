import { Slot } from '@/makeswift/slot'

type PageParams = { lang: string }

export default async function Page({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { lang: locale } = await params

  return (
    <Slot
      snapshotId="hardcoded"
      label="Hardcoded content"
      locale={locale}
      fallback={
        <div className="flex flex-col gap-y-4 px-2 py-8">
          <h2 className="text-3xl font-bold capitalize">Hardcoded page</h2>
          <p>
            Toggle &quot;Use fallback&quot; checkbox in the builder to start
            editing this page&apos;s content
          </p>
        </div>
      }
    />
  )
}
