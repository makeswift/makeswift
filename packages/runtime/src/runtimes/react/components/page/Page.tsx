import { useMemo } from 'react'

import { DocumentRoot } from '../DocumentRoot'
import { type Document } from '../../../../state/react-page'
import { MakeswiftPageDocument } from '../../../../client'
import { usePageSnippets } from '../hooks/use-page-snippets'

import { BodySnippet } from './BodySnippet'
import { PageHead } from './PageHead'
import { type HeadComponentProp } from './head-tags'
import { flattenMetadataSettings, type PageMetadataSettings } from './page-seo-settings'

type Props = {
  page: MakeswiftPageDocument
  rootDocument: Document
  metadata?: boolean | PageMetadataSettings
} & HeadComponentProp

export function Page({ page, rootDocument, Head, metadata = true }: Props): JSX.Element {
  const { bodySnippets } = usePageSnippets({ page })
  const pageMetadataSettings = useMemo(() => flattenMetadataSettings(metadata), [metadata])

  return (
    <>
      <PageHead document={page} metadata={pageMetadataSettings} Head={Head} />

      <DocumentRoot rootDocument={rootDocument} />

      {bodySnippets.map(snippet => (
        <BodySnippet key={snippet.id} code={snippet.code} cleanup={snippet.cleanup} />
      ))}
    </>
  )
}
