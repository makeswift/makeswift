import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogPost } from '@/components/blog-post'
import { env } from '@/env'
import { Slot } from '@/lib/makeswift/slot'
import { getAllBlogs, getBlogPost } from '@/lib/sanity/fetchers'
import { SectionLayout } from '@/vibes/soul/sections/section-layout'

export async function generateStaticParams() {
  const blogs = await getAllBlogs()

  return blogs.map(blog => ({ slug: blog?.slug?.current }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogPost(slug)

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  const blogUrl = new URL(`/blog/${slug}`, env.NEXT_PUBLIC_SITE_URL).href

  const { image, title, author } = blog

  const description =
    blog.description || `Read ${title ?? 'this post'} - A blog post by ${author?.name || 'our team'}.`

  const imageMetadata =
    image && image.asset && image.asset.url && image.asset.metadata?.dimensions
      ? {
          url: image.asset.url,
          width: image.asset.metadata.dimensions.width ?? undefined,
          height: image.asset.metadata.dimensions.height ?? undefined,
          alt: image.asset.title || title || 'Blog post image',
        }
      : undefined

  return {
    title,
    description,
    alternates: {
      canonical: blogUrl,
    },
    authors: author?.name ? [{ name: author.name }] : undefined,
    openGraph: {
      title: title ?? undefined,
      description,
      url: blogUrl,
      type: 'article',
      locale: 'en_US',
      images: imageMetadata ? [imageMetadata] : undefined,
      publishedTime: blog.publishedAt,
      authors: author?.name ? [author.name] : undefined,
    },
    twitter: {
      card: imageMetadata ? 'summary_large_image' : 'summary',
      title: title ?? undefined,
      description,
      images: imageMetadata ? [imageMetadata] : undefined,
    },
  }
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
