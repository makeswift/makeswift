import { MAKESWIFT_SITE_API_KEY } from '@/makeswift/env'
import { runtime } from '@/makeswift/runtime'
import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

// This import is required for the Smartling integration.
// To translate a page, we need to iterate the component data finding all translatable strings.
// Without control definitions, we can't traverse the component data.
// Importing components here allows us to get translatable strings and merge them back once they are translated.
import '@/makeswift/components'

export default MakeswiftApiHandler(MAKESWIFT_SITE_API_KEY, {
  runtime,
  apiOrigin: process.env.MAKESWIFT_API_ORIGIN,
  appOrigin: process.env.MAKESWIFT_APP_ORIGIN,
})
