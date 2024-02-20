'use client'

import { BodySnippet } from './BodySnippet'
import { DocumentReference } from '../../runtimes/react'
import { createDocumentReference } from '../../state/react-page'
import { MakeswiftPageDocument } from '../../next'
import { useRouterLocaleSync } from '../hooks/useRouterLocaleSync'
import { usePageSnippets } from '../hooks/usePageSnippets'
import { PageHead } from './PageHead'

type Props = {
  document: MakeswiftPageDocument
}

export function Page({ document: page }: Props): JSX.Element {
  const { bodySnippets } = usePageSnippets({ page })

  const baseLocalizedPage = page.localizedPages.find(({ parentId }) => parentId == null)
  const documentId = baseLocalizedPage?.elementTreeId ?? page.id

  useRouterLocaleSync()

  return (
    <>
      <PageHead document={page} />

      <DocumentReference documentReference={createDocumentReference(documentId)} />

      {bodySnippets.map(snippet => (
        <BodySnippet key={snippet.id} code={snippet.code} cleanup={snippet.cleanup} />
      ))}
    </>
  )
}
