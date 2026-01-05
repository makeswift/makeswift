import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogPost } from '@/components/blog-post'
import { env } from '@/env'
import { getAllBlogs, getBlogPost } from '@/lib/contentstack/fetchers'
import { Slot } from '@/lib/makeswift/slot'
import { SectionLayout } from '@/vibes/soul/sections/section-layout'

export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  return blogs.filter(blog => blog?.slug).map(blog => ({ slug: blog.slug }))
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

  const blogUrl = `${env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`

  const { bannerConnection, title, authorConnection } = blog
  const banner = bannerConnection?.edges?.[0]?.node
  const author = authorConnection?.edges?.[0]?.node

  const imageMetadata =
    banner && banner.url
      ? {
          url: banner.url,
          width: banner.dimension?.width ?? undefined,
          height: banner.dimension?.height ?? undefined,
          alt: banner.description || title || 'Blog post image',
        }
      : undefined

  const description =
    blog.description || `Read ${blog.title} - A blog post by ${author?.title || 'our team'}.`

  return {
    title,
    description,
    alternates: {
      canonical: blogUrl,
    },
    authors: author?.title ? [{ name: author.title }] : undefined,
    openGraph: {
      title: title ?? undefined,
      description,
      url: blogUrl,
      type: 'article',
      locale: 'en_US',
      images: imageMetadata ? [imageMetadata] : undefined,
      publishedTime: blog.feed_date,
      authors: author?.title ? [author.title] : undefined,
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
