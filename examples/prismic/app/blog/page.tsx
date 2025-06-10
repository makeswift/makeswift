import { notFound } from 'next/navigation'

import { MakeswiftComponent } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { BLOG_EMBEDDED_COMPONENT_ID } from '@/components/Builtins/Blog/Blog.makeswift'
import { client as MakeswiftClient } from '@/lib/makeswift/client'
import { getAllBlogs } from '@/lib/prismic/fetchers'
import { PrismicProvider } from '@/lib/prismic/provider'

export default async function Page() {
  const blogs = await getAllBlogs()

  const componentSnapshot = await MakeswiftClient.getComponentSnapshot('blog-component', {
    siteVersion: await getSiteVersion(),
  })

  if (componentSnapshot == null) return notFound()

  return (
    <PrismicProvider value={blogs}>
      <MakeswiftComponent
        snapshot={componentSnapshot}
        label="Blog"
        type={BLOG_EMBEDDED_COMPONENT_ID}
      />
    </PrismicProvider>
  )
}
