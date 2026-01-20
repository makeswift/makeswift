import { MAKESWIFT_SITE_API_KEY } from '@/makeswift/env'
import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

import { runtime } from '@/makeswift/runtime'

// required to make custom components' data available for introspection
import '@/makeswift/components'

const handler = MakeswiftApiHandler(MAKESWIFT_SITE_API_KEY, {
  runtime,
  apiOrigin: process.env.NEXT_PUBLIC_MAKESWIFT_API_ORIGIN,
  appOrigin: process.env.NEXT_PUBLIC_MAKESWIFT_APP_ORIGIN,
})

export { handler as GET, handler as POST, handler as OPTIONS }
