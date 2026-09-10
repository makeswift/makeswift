import { useMemo, ReactNode } from 'react'

import { DocumentRoot } from '../DocumentRoot'
import { type Document } from '../../../../state/read-only-state'
import { MakeswiftPageDocument } from '../../../../client'
import { usePageSnippets } from '../hooks/use-page-snippets'

import { BodySnippet } from './BodySnippet'
import { PageHead } from './PageHead'
import { flattenMetadataSettings, type PageMetadataSettings } from './page-seo-settings'
import { CSSObject } from '@emotion/serialize'
import { useBaseStyles } from '../../css-runtime/hooks/use-base-styles'

type Props = {
  page: MakeswiftPageDocument
  rootDocument: Document
  metadata?: boolean | PageMetadataSettings
}

const pageBaseStyles: CSSObject = {
  html: {
    fontFamily: 'sans-serif',
  },
  'div#__next': {
    overflow: 'hidden',
  },
}

export function Page({ page, rootDocument, metadata = true }: Props): ReactNode {
  const { bodySnippets } = usePageSnippets({ page })
  const pageMetadataSettings = useMemo(() => flattenMetadataSettings(metadata), [metadata])
  const { styleElement: baseStylesElement } = useBaseStyles({ styles: pageBaseStyles })

  return (
    <>
      <PageHead document={page} metadata={pageMetadataSettings} />

      <DocumentRoot rootDocument={rootDocument} />

      {baseStylesElement}
      {bodySnippets.map(snippet => (
        <BodySnippet key={snippet.id} code={snippet.code} cleanup={snippet.cleanup} />
      ))}
    </>
  )
}
