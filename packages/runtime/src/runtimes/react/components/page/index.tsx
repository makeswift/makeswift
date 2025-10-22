import { useMemo, memo, type ComponentProps, Fragment } from 'react'

import { useCacheData } from '../../hooks/use-cache-data'

import { type MakeswiftPageSnapshot, pageToRootDocument } from '../../../../client'

import { type PageMetadataSettings } from './page-seo-settings'
import { Page as PageComponent } from './Page'
import { useRegisterDocument } from '../../hooks/use-register-document'

export { type PageMetadataSettings } from './page-seo-settings'

/**
 * @param snapshot - The snapshot of the page to render, from
 * `client.getPageSnapshot()`.
 * @param metadata - Allows control over whether to use data from Makeswift for
 * rendering metadata tags in the `<head>` of the page. Pass `true` (default if
 * not provided) to render all metadata tags, or `false` to not render any. For
 * more granular control, pass an object with boolean values for specific
 * metadata fields. Valid fields include:
 *  - `title`
 *  - `description`
 *  - `keywords`
 *  - `socialImage`
 *  - `canonicalUrl`
 *  - `indexingBlocked`
 *  - `favicon`
 *
 * If a field is not provided, it will default to `false`.
 */
export const Page = memo(
  ({
    snapshot,
    metadata = true,
  }: {
    snapshot: MakeswiftPageSnapshot
    metadata?: boolean | PageMetadataSettings
  }) => {
    useCacheData(snapshot.cacheData)

    const rootDocument = useMemo(() => pageToRootDocument(snapshot.document), [snapshot.document])
    useRegisterDocument(rootDocument)

    return (
      <Fragment>
        {/* We use a key here to reset the Snippets state in the PageMeta component */}
        <PageComponent
          key={snapshot.document.data.key}
          page={snapshot.document}
          rootDocument={rootDocument}
          metadata={metadata}
        />
      </Fragment>
    )
  },
)

export type PageProps = ComponentProps<typeof Page>
