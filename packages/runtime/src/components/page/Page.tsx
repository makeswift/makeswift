'use client'

import { BodySnippet } from './BodySnippet'
import { DocumentRoot } from '../../runtimes/react'
import { type Document } from '../../state/react-page'
import { MakeswiftPageDocument } from '../../next'
import { useRouterLocaleSync } from '../hooks/useRouterLocaleSync'
import { usePageSnippets } from '../hooks/usePageSnippets'
import { PageHead } from './PageHead'

type Props = {
  page: MakeswiftPageDocument
  rootDocument: Document
}

export function Page({ page, rootDocument }: Props): JSX.Element {
  const { bodySnippets } = usePageSnippets({ page })

  useRouterLocaleSync()

  return (
    <>
      <PageHead document={page} />

      <DocumentRoot rootDocument={rootDocument} />

      {bodySnippets.map(snippet => (
        <BodySnippet key={snippet.id} code={snippet.code} cleanup={snippet.cleanup} />
      ))}
    </>
  )
}
