import { Slot as MakeswiftSlot } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { client } from './client'

export async function Slot({
  snapshotId,
  locale,
  label,
  fallback,
}: {
  snapshotId: string
  locale: string
  label: string
  fallback?: React.ReactNode
}) {
  const snapshot = await client.getComponentSnapshot(snapshotId, {
    siteVersion: await getSiteVersion(),
    locale,
  })

  return <MakeswiftSlot snapshot={snapshot} label={label} fallback={fallback} />
}
