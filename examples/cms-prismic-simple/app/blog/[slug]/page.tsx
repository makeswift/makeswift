import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogPost } from '@/components/blog-post'
import { env } from '@/env'
import { Slot } from '@/lib/makeswift/slot'
import { getBlogPost } from '@/lib/prismic/fetchers'
import { SectionLayout } from '@/vibes/soul/sections/section-layout'

interface BlogPageProps {
  params: Promise<{ slug: string }>
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

  const { hero, title, author } = blog

  const imageMetadata =
    hero && hero.url
      ? {
          url: hero.url,
          width: hero.dimensions?.width ?? undefined,
          height: hero.dimensions?.height ?? undefined,
          alt: hero.alt || title || 'Blog post image',
          type: hero.contentType ?? undefined,
        }
      : undefined

  const description =
    blog.meta_description || `Read ${title ?? 'this post'} - A blog post by ${author?.name || 'our team'}.`

  return {
    title: title || 'Blog Post',
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
      publishedTime: blog._meta.lastPublicationDate,
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
