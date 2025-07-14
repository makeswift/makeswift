import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogPost } from '@/components/blog-post'
import { Slot } from '@/lib/makeswift/slot'
import { getBlogPost } from '@/lib/prismic/fetchers'
import { SectionLayout } from '@/vibes/soul/sections/section-layout'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogPost(slug)

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: blog.title || 'Blog Post',
    description: blog.title || 'Blog post content',
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  const blog = await getBlogPost(slug)

  if (!blog) {
    notFound()
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
