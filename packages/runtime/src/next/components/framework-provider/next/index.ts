import NextImage from 'next/image'
import { Link } from './link'

import { type SiteVersion } from '../../../../api/site-version'
import {
  versionedFetch,
  type FrameworkContext,
} from '../../../../runtimes/react/components/framework-context'
import { MAKESWIFT_CACHE_TAG } from '../../../cache'

export const context: Pick<FrameworkContext, 'Image' | 'Link' | 'versionedFetch'> = {
  Image: NextImage,
  Link,
  versionedFetch: (siteVersion: SiteVersion | null) => (url, init) =>
    versionedFetch(siteVersion)(url, { ...init, next: { tags: [MAKESWIFT_CACHE_TAG] } }),
}
