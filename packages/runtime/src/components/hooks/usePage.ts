import { useQuery } from '@apollo/client'

import { PAGE_PATHNAMES_BY_ID } from '../utils/queries'

type Page = {
  id: string
  pathname: string
}

export function usePage(pageId: string | null | undefined): Page | null | undefined {
  const { error, data = {} } = useQuery(PAGE_PATHNAMES_BY_ID, {
    skip: pageId == null,
    variables: { ids: [pageId] },
  })

  if (pageId == null || error != null) return null

  const { pagePathnamesById: [page] = [] } = data

  return page
}
