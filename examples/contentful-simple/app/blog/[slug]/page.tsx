import { notFound } from 'next/navigation'

import { BlogPost } from '@/components/blog-post'
import { getAllBlogs } from '@/lib/contentful/fetchers'
import { Slot } from '@/lib/makeswift/slot'
import { SectionLayout } from '@/vibes/soul/sections/section-layout'

export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  return blogs.map(blog => ({ slug: blog?.slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (!slug) {
    return notFound()
  }

  return (
    <>
      <BlogPost slug={slug} />
      <SectionLayout>
        <Slot label={`Blog footer`} snapshotId="blog-footer" />
      </SectionLayout>
    </>
  )
}
