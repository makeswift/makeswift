import { Makeswift } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { runtime } from '@/makeswift/runtime'
import { MAKESWIFT_SITE_API_KEY } from '@/makeswift/env'

export const client = new Makeswift(MAKESWIFT_SITE_API_KEY, {
  runtime,
  apiOrigin: process.env.MAKESWIFT_API_ORIGIN,
})

export const getComponentSnapshot = async (snapshotId: string) => {
  // const locale = await getLocale();

  return await client.getComponentSnapshot(snapshotId, {
    // locale: locale === defaultLocale ? undefined : locale,
    siteVersion: await getSiteVersion(),
  })
}
