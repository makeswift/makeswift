'use client'

import { useMemo } from 'react'
import { BodySnippet } from './BodySnippet'
import { DocumentRoot } from '../../runtimes/react'
import { type Document } from '../../state/react-page'
import { MakeswiftPageDocument } from '../../next'
import { useRouterLocaleSync } from '../hooks/useRouterLocaleSync'
import { usePageSnippets } from '../hooks/usePageSnippets'
import { PageHead } from './PageHead'
import { flattenMetadataSettings, type PageMetadataSettings } from './page-seo-settings'

type Props = {
  page: MakeswiftPageDocument
  rootDocument: Document
  metadata?: boolean | PageMetadataSettings
}

export function Page({ page, rootDocument, metadata = true }: Props): JSX.Element {
  const { bodySnippets } = usePageSnippets({ page })
  const pageMetadataSettings = useMemo(() => flattenMetadataSettings(metadata), [metadata])

  useRouterLocaleSync()

  return (
    <>
      <PageHead document={page} metadata={pageMetadataSettings} />

      <DocumentRoot rootDocument={rootDocument} />

      {bodySnippets.map(snippet => (
        <BodySnippet key={snippet.id} code={snippet.code} cleanup={snippet.cleanup} />
      ))}
    </>
  )
}
