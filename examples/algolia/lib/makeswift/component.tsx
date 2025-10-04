import { MakeswiftComponent } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { client } from './client'

export const Component = async ({
  snapshotId,
  label,
  ...props
}: {
  type: string
  label: string
  snapshotId: string
}) => {
  const snapshot = await client.getComponentSnapshot(snapshotId, {
    siteVersion: await getSiteVersion(),
  })

  return <MakeswiftComponent label={label} snapshot={snapshot} {...props} />
}