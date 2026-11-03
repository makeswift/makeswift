import { useMemo, ReactNode } from 'react'

import { DocumentRoot } from '../DocumentRoot'
import { type Document } from '../../../../state/read-only-state'
import { type CustomFontVariant, MakeswiftPageDocument } from '../../../../client'
import { usePageSnippets } from '../hooks/use-page-snippets'

import { BodySnippet } from './BodySnippet'
import { PageHead } from './PageHead'
import { flattenMetadataSettings, type PageMetadataSettings } from './page-seo-settings'

type Props = {
  page: MakeswiftPageDocument
  customFontVariants?: CustomFontVariant[]
  rootDocument: Document
  metadata?: boolean | PageMetadataSettings
}

export function Page({
  page,
  customFontVariants,
  rootDocument,
  metadata = true,
}: Props): ReactNode {
  const { bodySnippets } = usePageSnippets({ page })
  const pageMetadataSettings = useMemo(() => flattenMetadataSettings(metadata), [metadata])

  return (
    <>
      <PageHead
        document={page}
        customFontVariants={customFontVariants}
        metadata={pageMetadataSettings}
      />

      <DocumentRoot rootDocument={rootDocument} />

      {bodySnippets.map(snippet => (
        <BodySnippet key={snippet.id} code={snippet.code} cleanup={snippet.cleanup} />
      ))}
    </>
  )
}
