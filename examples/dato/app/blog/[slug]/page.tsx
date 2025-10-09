import { notFound } from 'next/navigation'

import { BlogPost } from '@/components/builtins/BlogPost'
import { GetBlogDocument } from '@/generated/dato'
import { client } from '@/lib/dato/client'
import { getAllBlogs } from '@/lib/dato/fetchers'
import { DatoProvider } from '@/lib/dato/provider'

export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  return blogs.map(blog => ({ slug: blog?.slug }))
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params

  const { blogpost } = await client.request(GetBlogDocument, {
    slug,
  })

  if (!blogpost) {
    return notFound()
  }

  return (
    <DatoProvider value={{ blogpost }}>
      <BlogPost label="Blog Post" id="blog-post" />
    </DatoProvider>
  )
}
