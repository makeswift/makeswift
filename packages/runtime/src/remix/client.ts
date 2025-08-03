import { MakeswiftSiteVersion } from '../api/site-version'

import { MakeswiftClient } from '../client'

export class Makeswift extends MakeswiftClient {
  fetchOptions(_siteVersion: MakeswiftSiteVersion): Record<string, unknown> {
    return {}
  }
}
