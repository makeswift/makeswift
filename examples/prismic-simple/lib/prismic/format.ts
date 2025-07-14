import { asHTML } from '@prismicio/client'

import { GetBlogQuery, GetBlogsQuery } from '@/generated/prismic'
import { type BlogPost as FormattedBlogPost } from '@/vibes/soul/primitives/blog-post-card'

// Type for blog post from the listing query (no body field)
export type BlogPostFromQuery = NonNullable<
  NonNullable<GetBlogsQuery['allBlogposts']['edges']>[number]
>['node']

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
  if (!blog.title || !blog.feed_date || !blog.hero?.url) {
    throw new Error('Blog post is missing one or more required fields')
  }

  return {
    title: blog.title,
    date: new Date(blog.feed_date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    content: '', // GetBlogsQuery doesn't include body field, so content is always empty
    image: blog.hero ? { src: blog.hero.url, alt: blog.title } : null,
    author: 'Prismic Author', // Prismic doesn't have author in the current schema
    href: `/blog/${blog._meta?.uid}`,
  }
}
