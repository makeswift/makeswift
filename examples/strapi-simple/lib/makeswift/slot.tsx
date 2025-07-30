import { Slot as MakeswiftSlot } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { client } from './client'

export async function Slot({
  snapshotId,
  label,
  fallback,
}: {
  snapshotId: string
  label: string
  fallback?: React.ReactNode
}) {
  const snapshot = await client.getComponentSnapshot(snapshotId, { siteVersion: getSiteVersion() })
  return <MakeswiftSlot fallback={fallback} label={label} snapshot={snapshot} />
}
