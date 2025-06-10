import { notFound } from 'next/navigation'

import { BlogPost } from '@/components/builtins/BlogPost'
import { GetBlogDocument } from '@/generated/dato'
import { client } from '@/lib/dato/client'
import { getAllBlogs } from '@/lib/dato/fetchers'
import { DatoProvider } from '@/lib/dato/provider'

export async function generateStaticParams() {
  const allBlogposts = await getAllBlogs()
  return allBlogposts.filter(({ slug }) => slug).map(({ slug }) => ({ slug }))
}

export default async function BlogPostPage({ params, ...rest }: { params: { slug: string } }) {
  const { slug } = params

  const blogData = await client.request(GetBlogDocument, {
    slug,
  })

  if (!blogData.blogpost) {
    return notFound()
  }

  return (
    <DatoProvider value={blogData.blogpost}>
      <BlogPost id="blog-post" label="Blog Post" />
    </DatoProvider>
  )
}
