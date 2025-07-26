import { env } from '@/env'
import { AllBlogsQuery } from '@/generated/strapi'
import { type BlogPost as FormattedBlogPost } from '@/vibes/soul/primitives/blog-post-card'

export type BlogPostFromQuery = NonNullable<NonNullable<AllBlogsQuery['articles']>[0]>

export const formatBlogs = (
  blogs: BlogPostFromQuery[],
  includeBody: boolean = true
): FormattedBlogPost[] => {
  return blogs.map(blog => formatBlog(blog, includeBody))
}

export const formatBlog = (
  blog: BlogPostFromQuery,
  includeBody: boolean = true
): FormattedBlogPost => {
  if (!blog.slug || !blog.cover?.url) {
    throw new Error('Blog post is missing one or more required fields')
  }

  // Extract rich text content from blocks
  const richTextBlocks =
    blog.blocks?.filter(block => block?.__typename === 'ComponentSharedRichText') ?? []

  const bodyContent =
    includeBody && richTextBlocks.length > 0
      ? richTextBlocks.map(block => (block as any)?.body).join('\n')
      : blog.description

  return {
    title: blog.slug, // Using slug as title since title field is not in the query
    date: new Date().toLocaleDateString('en-US', {
      // Placeholder date since feedDate is not in query
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    content: bodyContent || blog.description,
    image: blog.cover
      ? { src: `${env.STRAPI_SERVER_DOMAIN}${blog.cover.url}`, alt: blog.slug }
      : null,
    author: blog.author?.name,
    href: `/blog/${blog.slug}`,
  }
}
