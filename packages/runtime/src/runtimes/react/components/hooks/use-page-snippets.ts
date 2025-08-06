import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'

import { type MakeswiftPageDocument, type Snippet, SnippetLocation } from '../../../../client'
import { type Page as PageType } from '../../../../api'

import deepEqual from '../../../../utils/deepEqual'

import { useIsInBuilder } from '../../hooks/use-is-in-builder'
import { useMakeswiftHostApiClient } from '../../host-api-client'

const filterUsedSnippetProperties = ({
  code,
  builderEnabled,
  liveEnabled,
  location,
  cleanup,
}: Snippet) => ({
  code,
  builderEnabled,
  liveEnabled,
  location,
  cleanup,
})

export function usePageSnippets({ page }: { page: MakeswiftPageDocument }) {
  const isInBuilder = useIsInBuilder()
  const [snippets, setSnippets] = useState(page.snippets)

  // We're using cached results here for page snippets so that anytime the user
  // changes the snippets or fonts on the builder, the change would be reflected
  // here. See this PR for discussions and things we can do to improve it in the
  // future: https://github.com/makeswift/makeswift/pull/77
  const cachedPage = useCachedPage(isInBuilder ? page.id : null)
  useEffect(() => {
    if (cachedPage == null) return

    const oldSnippets = snippets.map(filterUsedSnippetProperties)
    const newSnippets = cachedPage.snippets.map(filterUsedSnippetProperties)

    if (deepEqual(newSnippets, oldSnippets)) return

    setSnippets(cachedPage.snippets)
  }, [cachedPage])

  const filteredSnippets = useMemo(
    () => snippets.filter(snippet => (isInBuilder ? snippet.builderEnabled : snippet.liveEnabled)),
    [snippets, isInBuilder],
  )

  const headSnippets = useMemo(
    () => filteredSnippets.filter(snippet => snippet.location === SnippetLocation.Head),
    [filteredSnippets],
  )

  const bodySnippets = useMemo(
    () => filteredSnippets.filter(snippet => snippet.location === SnippetLocation.Body),
    [filteredSnippets],
  )

  return { headSnippets, bodySnippets }
}

function useCachedPage(pageId: string | null): PageType | null {
  const client = useMakeswiftHostApiClient()
  const getSnapshot = () => (pageId == null ? null : client.readPage(pageId))

  const page = useSyncExternalStore(client.subscribe, getSnapshot, getSnapshot)

  return page
}
