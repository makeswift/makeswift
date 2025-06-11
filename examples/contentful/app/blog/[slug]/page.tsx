import { notFound } from 'next/navigation'

import { BlogPost } from '@/components/builtins/BlogPost'
import { GetBlogsDocument } from '@/generated/contentful'
import { client } from '@/lib/contentful/client'
import { getAllBlogs } from '@/lib/contentful/fetchers'
import { ContentfulProvider } from '@/lib/contentful/provider'

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
