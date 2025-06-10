import { notFound } from 'next/navigation'

import { MakeswiftComponent } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { BLOG_POST_EMBEDDED_COMPONENT_ID } from '@/components/Builtins/BlogPost/BlogPost.makeswift'
import { GetBlogDocument } from '@/generated/dato'
import { client } from '@/lib/dato/client'
import { getAllBlogs } from '@/lib/dato/fetchers'
import { DatoProvider } from '@/lib/dato/provider'
import { client as MakeswiftClient } from '@/lib/makeswift/client'

export async function generateStaticParams() {
  const allBlogposts = await getAllBlogs()
  return allBlogposts.map(({ slug }) => ({ slug }))
}

export default async function Page({ params, ...rest }: { params: { slug: string } }) {
  const { slug } = params

  if (!slug) {
    return notFound()
  }

  const componentSnapshot = await MakeswiftClient.getComponentSnapshot(
    BLOG_POST_EMBEDDED_COMPONENT_ID,
    {
      siteVersion: await getSiteVersion(),
    }
  )

  const blogData = await client.request(GetBlogDocument, {
    slug,
  })

  if (componentSnapshot == null) return notFound()

  return (
    <DatoProvider value={blogData.blogpost}>
      <MakeswiftComponent
        snapshot={componentSnapshot}
        label="Blog Page"
        type={BLOG_POST_EMBEDDED_COMPONENT_ID}
      />
    </DatoProvider>
  )
}
