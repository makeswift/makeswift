import { type SiteVersion, MakeswiftClient } from '@makeswift/runtime/unstable-framework-support'

export class Makeswift extends MakeswiftClient {
  fetchOptions(_siteVersion: SiteVersion | null): Record<string, unknown> {
    return {}
  }
}
