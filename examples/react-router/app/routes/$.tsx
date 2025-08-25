import { Page } from 'lib/makeswift/page'

import type { Route } from './+types/$'

export { loader } from 'lib/makeswift/page/loader'

export default function Home(props: Route.ComponentProps) {
  return <Page {...props} />
}
