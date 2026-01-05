import { jsonToHtml } from '@contentstack/json-rte-serializer'

import { GetBlogsQuery } from '@/generated/contentstack'
import { type BlogPost as FormattedBlogPost } from '@/vibes/soul/primitives/blog-post-card'

export type BlogPostFromQuery = NonNullable<
  NonNullable<NonNullable<GetBlogsQuery['all_blog_post']>['items']>[0]
>

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
  if (!blog.slug || !blog.title || !blog.feed_date || (includeBody && !blog.body)) {
    throw new Error('Blog post is missing one or more required fields')
  }

  const banner = blog.bannerConnection?.edges?.[0]?.node

  return {
    title: blog.title,
    date: new Date(blog.feed_date).toISOString(),
    content: includeBody ? renderContentstackRTE(blog.body) : blog.description || '',
    image: banner?.url
      ? {
          src: banner.url,
          alt: banner.description || blog.title,
        }
      : null,
    author: blog.authorConnection?.edges?.[0]?.node?.title,
    href: `/blog/${blog.slug}`,
  }
}

// Helper function to render Contentstack JSON RTE content to HTML
function renderContentstackRTE(jsonRTE: any): string {
  if (!jsonRTE) return ''

  try {
    // If it's already a string, return it
    if (typeof jsonRTE === 'string') {
      return jsonRTE
    }

    // If it's a JSON object, convert it to HTML using Contentstack's serializer
    return jsonToHtml(jsonRTE)
  } catch (error) {
    console.error('Error rendering Contentstack RTE:', error)
    return ''
  }
}
