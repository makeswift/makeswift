import { env } from '@/env'
import { GetBlogPostsQuery } from '@/generated/strapi'
import { type BlogPost as FormattedBlogPost } from '@/vibes/soul/primitives/blog-post-card'

export type BlogPostFromQuery = NonNullable<NonNullable<GetBlogPostsQuery['blogPosts']>[0]>

const constructImageUrl = (url: string, domain: string): string => {
  return url.startsWith('http') ? url : `${domain}${url}`
}

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
  if (!blog.slug || !blog.banner?.url) {
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
    image: blog.banner
      ? {
          src: constructImageUrl(blog.banner.url, env.NEXT_PUBLIC_STRAPI_SERVER_URL),
          alt: blog.slug,
        }
      : null,
    author: blog.author?.name,
    description: blog.description,
    href: `/blog/${blog.slug}`,
  }
}
