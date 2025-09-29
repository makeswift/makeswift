import NextImage from 'next/image'
import { Link } from './link'

import { type SiteVersion } from '../../../../api/site-version'
import {
  DefaultElementData,
  versionedFetch,
  type FrameworkContext,
} from '../../../../runtimes/react/components/framework-context'
import { MAKESWIFT_CACHE_TAG } from '../../../cache'

export const context: Pick<FrameworkContext, 'Image' | 'Link' | 'versionedFetch' | 'ElementData'> =
  {
    Image: NextImage,
    Link,
    versionedFetch: (siteVersion: SiteVersion | null) => (url, init) =>
      versionedFetch(siteVersion)(url, { ...init, next: { tags: [MAKESWIFT_CACHE_TAG] } }),
    ElementData: DefaultElementData,
  }
