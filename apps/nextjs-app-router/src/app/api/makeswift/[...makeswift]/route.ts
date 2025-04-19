import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

import { config } from '@/lib/makeswift/config'

// required to make custom components' data available for introspection
import '@/lib/makeswift/components'

const handler = MakeswiftApiHandler(config)

export { handler as GET, handler as POST }
