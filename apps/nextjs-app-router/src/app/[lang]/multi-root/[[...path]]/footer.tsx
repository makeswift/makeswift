import { Slot } from '@/makeswift/slot'

export async function Footer({ lang }: { lang: string }) {
  return (
    <Slot
      snapshotId="footer-content"
      locale={lang}
      label="Footer content"
      fallback={
        <div className="flex flex-col gap-y-4 px-2 py-8">
          <h2 className="text-3xl font-bold capitalize">Footer Region</h2>
          <p>
            {`Toggle "Use fallback" checkbox in the builder to start editing this
            region's content`}
          </p>
        </div>
      }
    />
  )
}
