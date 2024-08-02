'use client'

import { BodySnippet } from './BodySnippet'
import { DocumentReference } from '../../runtimes/react'
import { createDocumentReference } from '../../state/react-page'
import { MakeswiftPageDocument } from '../../next'
import { useRouterLocaleSync } from '../hooks/useRouterLocaleSync'
import { usePageSnippets } from '../hooks/usePageSnippets'
import { PageHead } from './PageHead'

type Props = {
  pageDocument: MakeswiftPageDocument
  documentKey: string
}

export function Page({ pageDocument: page, documentKey }: Props): JSX.Element {
  const { bodySnippets } = usePageSnippets({ page })

  useRouterLocaleSync()

  return (
    <>
      <PageHead document={page} />

      <DocumentReference documentReference={createDocumentReference(documentKey)} />

      {bodySnippets.map(snippet => (
        <BodySnippet key={snippet.id} code={snippet.code} cleanup={snippet.cleanup} />
      ))}
    </>
  )
}
