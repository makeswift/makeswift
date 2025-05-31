import { notFound } from 'next/navigation'

import { MakeswiftComponent } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { AUTHOR_EMBEDDED_COMPONENT_ID } from '@/components/Author/Author.makeswift'
import { GetAuthorsDocument } from '@/generated/contentful'
import { client } from '@/lib/contentful/client'
import { ContentfulProvider } from '@/lib/contentful/provider'
import { client as MakeswiftClient } from '@/lib/makeswift/client'

export async function generateStaticParams() {
  const authors = await client.request(GetAuthorsDocument, {})
  return authors.authorCollection?.items.map(authors => ({ slug: authors?.slug })) ?? []
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params

  if (!slug) {
    return notFound()
  }

  const componentSnapshot = await MakeswiftClient.getComponentSnapshot('author', {
    siteVersion: await getSiteVersion(),
  })

  if (componentSnapshot == null) return notFound()

  const authorData = await client.request(GetAuthorsDocument, { filter: { slug } })

  return (
    <ContentfulProvider value={authorData.authorCollection}>
      <MakeswiftComponent
        snapshot={componentSnapshot}
        label="Author Page"
        type={AUTHOR_EMBEDDED_COMPONENT_ID}
      />
    </ContentfulProvider>
  )
}
