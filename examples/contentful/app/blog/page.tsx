import { notFound } from 'next/navigation'

import { MakeswiftComponent } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { BLOG_EMBEDDED_COMPONENT_ID } from '@/components/Builtins/Blog/Blog.makeswift'
import { getAllBlogs } from '@/lib/contentful/fetchers'
import { ContentfulProvider } from '@/lib/contentful/provider'
import { client as MakeswiftClient } from '@/lib/makeswift/client'

export default async function Page() {
  const blogs = await getAllBlogs()

  const componentSnapshot = await MakeswiftClient.getComponentSnapshot('blog-component', {
    siteVersion: await getSiteVersion(),
  })

  if (componentSnapshot == null) return notFound()

  return (
    <ContentfulProvider value={blogs}>
      <MakeswiftComponent
        snapshot={componentSnapshot}
        label="Blog"
        type={BLOG_EMBEDDED_COMPONENT_ID}
      />
    </ContentfulProvider>
  )
}
