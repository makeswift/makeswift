'use client'

import { memo } from 'react'

import { Page as BuiltinPage, type PageProps } from '../../runtimes/react/components/page'

import { useRouterLocaleSync } from '../hooks/use-router-locale-sync'

export { type PageProps } from '../../runtimes/react/components/page'
import { CSSObject } from '@emotion/serialize'
import { useBaseStyles } from '../../runtimes/react/css-runtime/hooks/use-base-styles'

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
export const Page = memo(({ snapshot, metadata, ...extras }: PageProps) => {
  if ('runtime' in extras) {
    throw new Error(
      `The \`runtime\` prop is no longer supported in the \`@makeswift/runtime\` \`Page\` component as of \`0.15.0\`.
See our docs for more information on what's changed and instructions to migrate: https://docs.makeswift.com/migrations/0.15.0`,
    )
  }

  useRouterLocaleSync()

  const pageBaseStyles: CSSObject = {
    html: {
      fontFamily: 'sans-serif',
    },
    'div#__next': {
      overflow: 'hidden',
    },
  }
  const { styleElement: baseStylesElement } = useBaseStyles({ styles: pageBaseStyles })

  return (
    <>
      <BuiltinPage snapshot={snapshot} metadata={metadata} />
      {baseStylesElement}
    </>
  )
})
