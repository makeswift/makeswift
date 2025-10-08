import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogPost } from '@/components/builtins/BlogPost'
import { env } from '@/env'
import { GetBlogsDocument } from '@/generated/contentful'
import { client } from '@/lib/contentful/client'
import { getAllBlogs, getBlogPost } from '@/lib/contentful/fetchers'
import { ContentfulProvider } from '@/lib/contentful/provider'

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

  const { banner, title, author } = blog

  const imageMetadata =
    banner && banner.url
      ? {
          url: banner.url,
          width: banner.width ?? undefined,
          height: banner.height ?? undefined,
          alt: banner.title || title || 'Blog post image',
          type: banner.contentType ?? undefined,
        }
      : undefined

  const description =
    blog.description || `Read ${blog.title} - A blog post by ${blog.author?.name || 'our team'}.`

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
      publishedTime: blog.feedDate ?? undefined,
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

export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  return blogs.map(blog => ({ slug: blog?.slug }))
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  const { blogPostCollection } = await client.request(GetBlogsDocument, {
    filter: { slug },
  })

  if (!blogPostCollection || blogPostCollection.total === 0) {
    return notFound()
  }

  return (
    <ContentfulProvider value={blogPostCollection}>
      <BlogPost label="Blog Post" id="blog-post" />
    </ContentfulProvider>
  )
}
