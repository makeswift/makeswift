import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogPost } from '@/components/blog-post'
import { getAllBlogs, getBlogPost } from '@/lib/contentful/fetchers'
import { Slot } from '@/lib/makeswift/slot'
import { SectionLayout } from '@/vibes/soul/sections/section-layout'

export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  return blogs.map(blog => ({ slug: blog?.slug }))
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const blogUrl = `${baseUrl}/blog/${slug}`

  const plainTextDescription =
    blog.description || `Read ${blog.title} - A blog post by ${blog.author?.name || 'our team'}.`

  const blogImage = blog.banner?.url
  const imageMetadata = blogImage
    ? {
        url: blogImage,
        width: blog.banner?.width || 1200,
        height: blog.banner?.height || 630,
        alt: blog.banner?.title || blog.title || 'Blog post image',
        type: blog.banner?.contentType || 'image/jpeg',
      }
    : undefined

  return {
    title: blog.title,
    description: plainTextDescription,
    alternates: {
      canonical: blogUrl,
    },
    keywords: [
      'blog',
      'article',
      blog.title ?? '',
      blog.author?.name || '',
    ].filter(Boolean),
    authors: blog.author?.name ? [{ name: blog.author.name }] : undefined,
    openGraph: {
      title: blog.title || '',
      description: plainTextDescription,
      url: blogUrl,
      siteName: 'Your Blog Site', // Replace with your actual site name
      type: 'article',
      locale: 'en_US',
      images: imageMetadata ? [imageMetadata] : undefined,
      publishedTime: blog.feedDate,
      authors: blog.author?.name ? [blog.author.name] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title || '',
      description: plainTextDescription,
      images: imageMetadata ? [imageMetadata.url] : undefined,
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
