import { notFound } from 'next/navigation'

import { MakeswiftComponent } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { BLOG_EMBEDDED_COMPONENT_ID } from '@/components/Builtins/Blog/Blog.makeswift'
import { getAllBlogs } from '@/lib/dato/fetchers'
import { DatoProvider } from '@/lib/dato/provider'
import { client as MakeswiftClient } from '@/lib/makeswift/client'

export default async function Page() {
  const allBlogposts = await getAllBlogs()

  const componentSnapshot = await MakeswiftClient.getComponentSnapshot(
    BLOG_EMBEDDED_COMPONENT_ID, //id of the component rendered on the page
    { siteVersion: await getSiteVersion() }
  )

  if (componentSnapshot == null) return notFound()

  return (
    <DatoProvider value={allBlogposts}>
      <MakeswiftComponent
        snapshot={componentSnapshot}
        label="Blog Page"
        type={BLOG_EMBEDDED_COMPONENT_ID}
      />
    </DatoProvider>
  )
}
