'use client'

import { ReactNode, createContext, useContext } from 'react'

import { GetAuthorsQuery, GetBlogsQuery } from '@/generated/contentful'

type CollectionType = GetBlogsQuery['blogPostCollection'] | GetAuthorsQuery['authorCollection']

const ContentfulContext = createContext<
  { data: CollectionType | NonNullable<CollectionType>['items'] } | undefined
>(undefined)

export function ContentfulProvider({
  children,
  value,
}: {
  children: ReactNode
  value: CollectionType | NonNullable<CollectionType>['items']
}) {
  return <ContentfulContext.Provider value={{ data: value }}>{children}</ContentfulContext.Provider>
}

export function useContentfulData() {
  const context = useContext(ContentfulContext)

  if (context === undefined) {
    return { error: 'useContentfulData must be used within a ContentfulProvider' }
  }

  if (!context.data) {
    return { error: 'No data found' }
  }

  if (Array.isArray(context.data)) {
    return { data: context.data }
  }

  return { data: context.data.items[0] }
}
