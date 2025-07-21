import { env } from '@/env'
import { GetBlogsQuery } from '@/generated/strapi'
import { type BlogPost as FormattedBlogPost } from '@/vibes/soul/primitives/blog-post-card'

export type BlogPostFromQuery = NonNullable<NonNullable<GetBlogsQuery['articles']>[0]>

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

  const bodyContent = includeBody && blog.body

  return {
    title: blog.title ?? blog.slug,
    date: new Date(blog.publishedAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    content: bodyContent,
    image: blog.cover
      ? {
          src: blog.cover.url.startsWith('http')
            ? blog.cover.url
            : `${env.STRAPI_SERVER_DOMAIN}${blog.cover.url}`,
          alt: blog.slug,
        }
      : null,
    author: blog.author?.name,
    description: blog.description,
    href: `/blog/${blog.slug}`,
  }
}
