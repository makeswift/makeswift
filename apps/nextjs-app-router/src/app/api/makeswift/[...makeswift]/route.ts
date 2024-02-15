import { MAKESWIFT_SITE_API_KEY } from '@/makeswift/env'
import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

const handler = MakeswiftApiHandler(MAKESWIFT_SITE_API_KEY, {
  apiOrigin: process.env.MAKESWIFT_API_ORIGIN,
  appOrigin: process.env.MAKESWIFT_APP_ORIGIN,
})

export { handler as GET, handler as POST }
